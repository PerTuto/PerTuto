import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export class DriveService {
    private drive;

    constructor(authJson: any) {
        const auth = new GoogleAuth({
            credentials: authJson,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        this.drive = google.drive({ version: 'v3', auth });
    }

    async listFiles(folderId: string) {
        const response = await this.drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, modifiedTime)',
        });
        return response.data.files || [];
    }

    async getFileContent(fileId: string): Promise<Buffer> {
        const response = await this.drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
        );
        return Buffer.from(response.data as ArrayBuffer);
    }
}
