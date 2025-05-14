
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BarChartBig, AlertCircle, CheckCircle2, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectNetworkAnomalies, type DetectNetworkAnomaliesInput, type DetectNetworkAnomaliesOutput } from "@/ai/flows/detect-network-anomalies";

export default function AnomalyDetectionPage() {
  const { toast } = useToast();
  const [networkTrafficData, setNetworkTrafficData] = useState("");
  const [baselineProfile, setBaselineProfile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DetectNetworkAnomaliesOutput | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!networkTrafficData) {
      toast({ title: "Error", description: "Network Traffic Data is required.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const input: DetectNetworkAnomaliesInput = { networkTrafficData };
      if (baselineProfile) {
        input.baselineProfile = baselineProfile;
      }
      const result = await detectNetworkAnomalies(input);
      setAnalysisResult(result);
      toast({ title: "Success", description: "Network anomaly detection complete." });
    } catch (err) {
      console.error("Anomaly detection error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during anomaly detection.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            AI-Powered Anomaly Detection
          </CardTitle>
          <CardDescription>
            Analyze network traffic data to identify unusual patterns and potential security threats using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="networkTrafficData">Network Traffic Data</Label>
              <Textarea
                id="networkTrafficData"
                placeholder="Paste network traffic data here (e.g., PCAP summary, logs, flow records)..."
                value={networkTrafficData}
                onChange={(e) => setNetworkTrafficData(e.target.value)}
                rows={8}
                required
                className="min-h-[150px] text-sm"
              />
              <p className="text-xs text-muted-foreground">Provide detailed network logs or summarized traffic information for analysis.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baselineProfile">Baseline Profile (Optional)</Label>
              <Textarea
                id="baselineProfile"
                placeholder="Describe normal network behavior or provide a baseline profile..."
                value={baselineProfile}
                onChange={(e) => setBaselineProfile(e.target.value)}
                rows={4}
                className="min-h-[100px] text-sm"
              />
               <p className="text-xs text-muted-foreground">Help the AI by describing what's considered normal for your network. If omitted, the AI will attempt to establish its own baseline.</p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 min-w-[150px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChartBig className="mr-2 h-4 w-4" />
                    Analyze Traffic
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Detection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {analysisResult.anomaliesDetected ? <AlertCircle className="h-6 w-6 text-destructive" /> : <CheckCircle2 className="h-6 w-6 text-green-500" />}
              Analysis Results
            </CardTitle>
            <CardDescription>Detailed report of the anomaly detection process.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card className="bg-secondary/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Anomalies Detected?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-semibold ${analysisResult.anomaliesDetected ? 'text-destructive' : 'text-green-600'}`}>
                        {analysisResult.anomaliesDetected ? "Yes" : "No"}
                        </p>
                    </CardContent>
                 </Card>
                 <Card className="bg-secondary/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Confidence Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-primary">
                        {(analysisResult.confidenceScore * 100).toFixed(0)}%
                        </p>
                    </CardContent>
                 </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Anomaly Report:</h3>
              <div className="p-4 bg-muted rounded-md min-h-[100px] text-sm whitespace-pre-wrap">
                {analysisResult.anomalyReport || "No specific anomalies reported."}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Suggested Actions:</h3>
              <div className="p-4 bg-muted rounded-md min-h-[100px] text-sm whitespace-pre-wrap">
                {analysisResult.suggestedActions || "No specific actions suggested."}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
