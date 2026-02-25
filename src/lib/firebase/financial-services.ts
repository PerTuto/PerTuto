import { firestore } from './client-app';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { 
  Invoice, 
  Payment, 
  LedgerTransaction, 
  InvoiceStatus, 
  LedgerTransactionType,
  PaymentMethod 
} from '../types';

/**
 * Creates a new invoice and records the corresponding 'Charge' in the ledger.
 */
export async function createInvoice(tenantId: string, invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Promise<string> {
  const batch = writeBatch(firestore);

  // 1. Create the Invoice document
  const invoiceRef = doc(collection(firestore, `tenants/${tenantId}/invoices`));
  const newInvoice: Invoice = {
    ...invoiceData,
    id: invoiceRef.id,
    createdAt: new Date(),
  };

  batch.set(invoiceRef, {
    ...newInvoice,
    issueDate: Timestamp.fromDate(newInvoice.issueDate),
    dueDate: Timestamp.fromDate(newInvoice.dueDate),
    createdAt: Timestamp.fromDate(newInvoice.createdAt),
  });

  // 2. Create the Ledger Transaction (Charge)
  if (invoiceData.status !== InvoiceStatus.Draft && invoiceData.status !== InvoiceStatus.Cancelled) {
    const ledgerRef = doc(collection(firestore, `tenants/${tenantId}/ledger`));
    const ledgerEntry: Omit<LedgerTransaction, 'id'> = {
      tenantId,
      studentId: invoiceData.studentId,
      parentId: invoiceData.parentId,
      type: LedgerTransactionType.Charge,
      amount: -invoiceData.totalAmount, // Charge decreases family balance
      description: `Invoice Generated: ${invoiceRef.id} - ${invoiceData.items.map(i => i.description).join(', ')}`,
      date: newInvoice.issueDate,
      relatedInvoiceId: invoiceRef.id,
      recordedBy: invoiceData.createdBy,
    };

    batch.set(ledgerRef, {
      ...ledgerEntry,
      date: Timestamp.fromDate(ledgerEntry.date),
    });
  }

  await batch.commit();
  return invoiceRef.id;
}

/**
 * Fetches all invoices for a tenant.
 */
export async function getInvoices(tenantId: string): Promise<Invoice[]> {
  const invoicesRef = collection(firestore, `tenants/${tenantId}/invoices`);
  const q = query(invoicesRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  const invoices: Invoice[] = [];
  querySnapshot.forEach((d) => {
    const data = d.data();
    invoices.push({
      ...data,
      id: d.id,
      issueDate: data.issueDate.toDate(),
      dueDate: data.dueDate.toDate(),
      createdAt: data.createdAt.toDate(),
    } as Invoice);
  });
  
  return invoices;
}

/**
 * Records a payment, updates the associated invoice (if provided), and creates a Ledger credit.
 */
export async function recordPayment(tenantId: string, paymentData: Omit<Payment, 'id'>): Promise<string> {
  const batch = writeBatch(firestore);

  // 1. Create the Payment document
  const paymentRef = doc(collection(firestore, `tenants/${tenantId}/payments`));
  const newPayment = {
    ...paymentData,
    date: Timestamp.fromDate(paymentData.date),
  };
  batch.set(paymentRef, newPayment);

  // 2. Create the Ledger Transaction (Payment/Credit)
  const ledgerRef = doc(collection(firestore, `tenants/${tenantId}/ledger`));
  const ledgerEntry: Omit<LedgerTransaction, 'id'> = {
    tenantId,
    studentId: paymentData.studentId,
    parentId: paymentData.parentId,
    type: LedgerTransactionType.Payment,
    amount: paymentData.amount, // Positive because they are adding money to their balance
    description: `Payment Received via ${paymentData.method}`,
    date: paymentData.date,
    relatedPaymentId: paymentRef.id,
    relatedInvoiceId: paymentData.invoiceId,
    recordedBy: paymentData.recordedBy,
  };
  batch.set(ledgerRef, {
    ...ledgerEntry,
    date: Timestamp.fromDate(ledgerEntry.date),
  });

  // 3. Update Invoice if this payment is tied directly to one
  if (paymentData.invoiceId) {
    const invoiceRef = doc(firestore, `tenants/${tenantId}/invoices`, paymentData.invoiceId);
    const invoiceSnap = await getDoc(invoiceRef);
    
    if (invoiceSnap.exists()) {
      const invoice = invoiceSnap.data() as Invoice;
      const newAmountPaid = (invoice.amountPaid || 0) + paymentData.amount;
      const newBalanceDue = invoice.totalAmount - newAmountPaid;
      
      let newStatus: InvoiceStatus = invoice.status;
      if (newBalanceDue <= 0) {
        newStatus = InvoiceStatus.Paid;
      } else if (newAmountPaid > 0) {
        newStatus = InvoiceStatus.Unpaid; // Paritally paid is still unpaid
      }

      batch.update(invoiceRef, {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus
      });
    }
  }

  await batch.commit();
  return paymentRef.id;
}

/**
 * Calculates a family's current Ledger Balance.
 * Positive = They have credit. Negative = They owe money.
 */
export async function getLedgerBalance(tenantId: string, studentId: string): Promise<number> {
  const ledgerRef = collection(firestore, `tenants/${tenantId}/ledger`);
  // Note: We might want to sum by parentId instead if siblings share a billing account.
  // For MVP, summing by studentId is safer and simpler.
  const q = query(ledgerRef, where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  
  let balance = 0;
  querySnapshot.forEach((doc) => {
    balance += doc.data().amount;
  });
  
  return balance;
}

/**
 * Fetches ledger history for a student.
 */
export async function getLedgerHistory(tenantId: string, studentId: string): Promise<LedgerTransaction[]> {
  const ledgerRef = collection(firestore, `tenants/${tenantId}/ledger`);
  const q = query(ledgerRef, where("studentId", "==", studentId), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  const transactions: LedgerTransaction[] = [];
  querySnapshot.forEach((d) => {
    const data = d.data();
    transactions.push({
      ...data,
      id: d.id,
      date: data.date.toDate(),
    } as LedgerTransaction);
  });
  
  return transactions;
}

/**
 * Updates the status of a specific invoice.
 */
export async function updateInvoiceStatus(
  tenantId: string, 
  invoiceId: string, 
  newStatus: InvoiceStatus
): Promise<void> {
  const invoiceRef = doc(firestore, `tenants/${tenantId}/invoices`, invoiceId);
  await updateDoc(invoiceRef, { status: newStatus });
}

/**
 * Marks an invoice as fully paid from the parent portal.
 * Creates a payment record and ledger credit, then updates the invoice.
 */
export async function markInvoiceAsPaid(
  tenantId: string,
  invoiceId: string,
  payerUserId: string,
  method: PaymentMethod = PaymentMethod.Other
): Promise<void> {
  const invoiceRef = doc(firestore, `tenants/${tenantId}/invoices`, invoiceId);
  const invoiceSnap = await getDoc(invoiceRef);
  
  if (!invoiceSnap.exists()) throw new Error('Invoice not found');
  
  const invoice = invoiceSnap.data() as Invoice;
  const amountToPay = invoice.balanceDue || (invoice.totalAmount - (invoice.amountPaid || 0));

  if (amountToPay <= 0) throw new Error('Invoice is already fully paid');

  await recordPayment(tenantId, {
    tenantId,
    invoiceId,
    studentId: invoice.studentId,
    parentId: invoice.parentId,
    amount: amountToPay,
    method,
    date: new Date(),
    recordedBy: payerUserId,
    notes: 'Paid via Parent Portal',
  });
}

