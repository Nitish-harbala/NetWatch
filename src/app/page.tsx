
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, UserX, BarChartBig, Bell, AlertCircle } from "lucide-react";
import Image from "next/image";

const recentActivities = [
  { id: "1", time: "10:45 AM", event: "Unusual login attempt from IP 192.168.1.100", severity: "High", icon: <UserX className="h-4 w-4 text-destructive" /> },
  { id: "2", time: "10:30 AM", event: "Port scan detected on port 80", severity: "Medium", icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  { id: "3", time: "09:15 AM", event: "Firewall rule 'Block All Inbound Port 22' updated", severity: "Low", icon: <ShieldAlert className="h-4 w-4 text-blue-500" /> },
  { id: "4", time: "08:00 AM", event: "Anomaly detected: High outbound traffic to unknown IP", severity: "High", icon: <BarChartBig className="h-4 w-4 text-destructive" /> },
];

const overviewStats = [
    { title: "Total Alerts Today", value: "12", icon: <Bell className="h-6 w-6 text-accent" />, change: "+5%", changeType: "positive" as "positive" | "negative" },
    { title: "Critical Threats", value: "3", icon: <ShieldAlert className="h-6 w-6 text-destructive" />, change: "+1", changeType: "negative" as "positive" | "negative" },
    { title: "Failed Logins", value: "27", icon: <UserX className="h-6 w-6 text-yellow-600" />, change: "-10%", changeType: "negative" as "positive" | "negative"},
    { title: "Anomalies Detected", value: "2", icon: <BarChartBig className="h-6 w-6 text-purple-500" />, change: "0", changeType: "positive" as "positive" | "negative"},
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change !== "0" && (
                 <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from yesterday
                 </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Recent Security Activity
            </CardTitle>
            <CardDescription>Latest security events and alerts from your network.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.time}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        {activity.icon}
                        {activity.event}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={activity.severity === "High" ? "destructive" : activity.severity === "Medium" ? "secondary" : "default"}
                             className={activity.severity === "Medium" ? "bg-yellow-500 text-white" : ""}>
                        {activity.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg" data-ai-hint="network security">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Image src="https://placehold.co/64x64.png" alt="Network Health" width={32} height={32} className="rounded" data-ai-hint="network security" />
                    Network Health Overview
                </CardTitle>
                <CardDescription>Visual representation of network traffic and potential threats.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                 <Image src="https://placehold.co/400x250.png" alt="Network Graph Placeholder" width={400} height={250} className="rounded-md shadow-md" data-ai-hint="network graph" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
