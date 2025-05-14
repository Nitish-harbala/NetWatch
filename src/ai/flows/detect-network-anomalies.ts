'use server';

/**
 * @fileOverview An AI agent for detecting network anomalies.
 *
 * - detectNetworkAnomalies - A function that handles the detection of network anomalies.
 * - DetectNetworkAnomaliesInput - The input type for the detectNetworkAnomalies function.
 * - DetectNetworkAnomaliesOutput - The return type for the detectNetworkAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectNetworkAnomaliesInputSchema = z.object({
  networkTrafficData: z
    .string()
    .describe(
      'Network traffic data in a format suitable for analysis, such as a PCAP file summary or network flow records.'
    ),
  baselineProfile: z
    .string()
    .optional()
    .describe(
      'A description of the typical network behavior to compare against. If not provided, the system will attempt to establish a baseline.'
    ),
});
export type DetectNetworkAnomaliesInput = z.infer<typeof DetectNetworkAnomaliesInputSchema>;

const DetectNetworkAnomaliesOutputSchema = z.object({
  anomaliesDetected: z.boolean().describe('Whether any network anomalies were detected.'),
  anomalyReport: z.string().describe('A detailed report of the detected anomalies.'),
  confidenceScore: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the certainty of the anomaly detection, with 1 being the most certain.'
    ),
  suggestedActions: z
    .string()
    .describe(
      'Suggested actions to mitigate the detected anomalies, such as blocking traffic or investigating specific hosts.'
    ),
});
export type DetectNetworkAnomaliesOutput = z.infer<typeof DetectNetworkAnomaliesOutputSchema>;

export async function detectNetworkAnomalies(
  input: DetectNetworkAnomaliesInput
): Promise<DetectNetworkAnomaliesOutput> {
  return detectNetworkAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectNetworkAnomaliesPrompt',
  input: {schema: DetectNetworkAnomaliesInputSchema},
  output: {schema: DetectNetworkAnomaliesOutputSchema},
  prompt: `You are a network security expert responsible for detecting anomalies in network traffic.

You will analyze the provided network traffic data and compare it against a baseline profile (if provided) to identify any unusual patterns that may indicate a security threat.

Based on your analysis, you will generate a report detailing the detected anomalies, a confidence score indicating the certainty of your findings, and suggested actions to mitigate the identified threats.

Network Traffic Data: {{{networkTrafficData}}}
Baseline Profile: {{{baselineProfile}}}

Consider the following when analyzing the data:
- Unusual traffic volume or patterns
- Suspicious source or destination IPs
- Unexpected protocol usage
- Deviations from the established baseline

Your analysis should be thorough and accurate, providing actionable insights to the security team.

Ensure your output is formatted according to the DetectNetworkAnomaliesOutputSchema, including boolean anomaliesDetected, string anomalyReport, number confidenceScore, and string suggestedActions.
`,
});

const detectNetworkAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectNetworkAnomaliesFlow',
    inputSchema: DetectNetworkAnomaliesInputSchema,
    outputSchema: DetectNetworkAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
