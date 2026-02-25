'use server';

/**
 * @fileOverview AI-powered attendance tracking using facial recognition from video feeds.
 *
 * - trackAttendanceWithFacialRecognition - A function to track attendance using facial recognition.
 * - TrackAttendanceInput - The input type for the trackAttendanceWithFacialRecognition function.
 * - TrackAttendanceOutput - The return type for the trackAttendanceWithFacialRecognition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackAttendanceInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'A snapshot image of the class, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  knownFacesDataUris: z
    .array(z.string())
    .describe(
      'An array of data URIs representing known faces of students, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  classRoster: z.array(z.string()).describe('An array of student names in the class.'),
});

export type TrackAttendanceInput = z.infer<typeof TrackAttendanceInputSchema>;

const TrackAttendanceOutputSchema = z.object({
  attendanceRecords: z.record(z.boolean()).describe('A record of student attendance, with student names as keys and boolean values indicating attendance.'),
  summary: z.string().describe('A summary of the attendance tracking process and any issues encountered.'),
});

export type TrackAttendanceOutput = z.infer<typeof TrackAttendanceOutputSchema>;

import { checkAIRateLimit } from '@/ai/rate-limiter';

export async function trackAttendanceWithFacialRecognition(
  input: TrackAttendanceInput
): Promise<TrackAttendanceOutput> {
  const allowed = await checkAIRateLimit();
  if (!allowed) throw new Error("Rate limit exceeded. Please try again later.");
  return trackAttendanceWithFacialRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trackAttendanceWithFacialRecognitionPrompt',
  input: {schema: TrackAttendanceInputSchema},
  output: {schema: TrackAttendanceOutputSchema},
  prompt: `You are an AI attendance tracker. Given an image of a class and a list of known faces, determine which students are present.

Image: {{media url=imageDataUri}}

Known Faces: {{#each knownFacesDataUris}}{{media url=this}}{{#unless @last}}, {{/unless}}{{/each}}

Class Roster: {{#each classRoster}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Output the attendance records as a JSON object with student names as keys and boolean values indicating attendance.
Also, provide a summary of the attendance tracking process and any issues encountered.

Considerations:
*  Take into account lighting, angle of capture, and clarity of image to accurately identify students.
*  Be aware of possible occlusions of student faces that could result in misidentification or inability to identify.
*  For those students who are not confidently identified or cannot be verified, mark them as absent.
*  If there are issues with the image or known faces, report these in the summary.
`,
});

const trackAttendanceWithFacialRecognitionFlow = ai.defineFlow(
  {
    name: 'trackAttendanceWithFacialRecognitionFlow',
    inputSchema: TrackAttendanceInputSchema,
    outputSchema: TrackAttendanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
