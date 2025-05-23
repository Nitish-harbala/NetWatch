
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, UserX, BarChartBig, Bell, AlertCircle, Network, LogIn } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Activity {
  id: string;
  time: string;
  event: string;
  severity: "High" | "Medium" | "Low" | "Info";
  icon: JSX.Element;
}

interface NetworkHealthItem {
  name: string;
  value: number;
  fill: string;
}

const initialActivities: Activity[] = [
  { id: "evt1", time: "10:45 AM", event: "Unusual login attempt from IP 192.168.1.100", severity: "High", icon: <UserX className="h-4 w-4 text-destructive" /> },
  { id: "evt2", time: "10:30 AM", event: "Port scan detected on port 80", severity: "Medium", icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  { id: "evt3", time: "09:15 AM", event: "Firewall rule 'Block All Inbound Port 22' updated", severity: "Low", icon: <ShieldAlert className="h-4 w-4 text-blue-500" /> },
  { id: "evt4", time: "08:00 AM", event: "Anomaly detected: High outbound traffic to unknown IP", severity: "High", icon: <BarChartBig className="h-4 w-4 text-destructive" /> },
];

const overviewStats = [
    { title: "Total Alerts Today", value: "12", icon: <Bell className="h-6 w-6 text-accent" />, change: "+5%", changeType: "positive" as "positive" | "negative" },
    { title: "Critical Threats", value: "3", icon: <ShieldAlert className="h-6 w-6 text-destructive" />, change: "+1", changeType: "negative" as "positive" | "negative" },
    { title: "Failed Logins", value: "27", icon: <UserX className="h-6 w-6 text-yellow-600" />, change: "-10%", changeType: "negative" as "positive" | "negative"},
    { title: "Anomalies Detected", value: "2", icon: <BarChartBig className="h-6 w-6 text-purple-500" />, change: "0", changeType: "positive" as "positive" | "negative"},
];

const initialNetworkHealthData: NetworkHealthItem[] = [
  { name: 'Normal Traffic', value: 4000, fill: 'hsl(var(--chart-2))' },
  { name: 'Suspicious Activity', value: 300, fill: 'hsl(var(--chart-4))' },
  { name: 'Blocked Threats', value: 150, fill: 'hsl(var(--destructive))' },
];

const MAX_ACTIVITIES = 10;

export default function DashboardPage() {
  const [recentActivities, setRecentActivities] = useState<Activity[]>(initialActivities);
  const [networkHealthData, setNetworkHealthData] = useState<NetworkHealthItem[]>(initialNetworkHealthData);
  const [currentTime, setCurrentTime] = useState<string | null>(null);


  useEffect(() => {
    // Set initial time on client mount
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const activityIntervalId = setInterval(() => {
      const currentTickTime = new Date();
      setCurrentTime(currentTickTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const randomOctet = () => Math.floor(Math.random() * 254) + 1;
      const randomIP = `192.168.${randomOctet()}.${randomOctet()}`;
      
      const newLoginEvent: Activity = {
        id: `evt${currentTickTime.getTime()}`,
        time: currentTickTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `New successful login from IP ${randomIP}`,
        severity: "Info",
        icon: <LogIn className="h-4 w-4 text-green-500" />
      };

      setRecentActivities(prevActivities => {
        const updatedActivities = [newLoginEvent, ...prevActivities];
        return updatedActivities.slice(0, MAX_ACTIVITIES);
      });

    }, 5000); // Add a new event every 5 seconds

    return () => clearInterval(activityIntervalId);
  }, []);


  useEffect(() => {
    const healthDataIntervalId = setInterval(() => {
      setNetworkHealthData(prevData => 
        prevData.map(item => {
          let newValue = item.value;
          const fluctuation = Math.random() * (item.value * 0.1); // Fluctuate by up to 10%
          if (item.name === 'Normal Traffic') {
            newValue = Math.max(2000, item.value + (Math.random() > 0.5 ? fluctuation : -fluctuation));
          } else if (item.name === 'Suspicious Activity') {
            newValue = Math.max(50, item.value + (Math.random() > 0.5 ? fluctuation / 2 : -fluctuation / 2));
          } else if (item.name === 'Blocked Threats') {
            newValue = Math.max(20, item.value + (Math.random() > 0.5 ? fluctuation / 3 : -fluctuation / 3));
          }
          return { ...item, value: Math.round(newValue) };
        })
      );
    }, 3000); // Update chart data every 3 seconds

    return () => clearInterval(healthDataIntervalId);
  }, []);


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
            <CardDescription>
              Latest security events and alerts from your network. Updates simulate live events. 
              {currentTime ? ` Current time: ${currentTime}` : ' Loading time...'}
            </CardDescription>
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
                      <Badge 
                        variant={
                          activity.severity === "High" ? "destructive" : 
                          activity.severity === "Medium" ? "secondary" : 
                          activity.severity === "Info" ? "default" : "default"
                        }
                        className={
                          activity.severity === "Medium" ? "bg-yellow-500 text-white" : 
                          activity.severity === "Info" ? "bg-green-500 text-white" : 
                          activity.severity === "Low" ? "bg-blue-500 text-white" : ""
                        }>
                        {activity.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg" data-ai-hint="network chart dynamic">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Network className="h-6 w-6 text-primary" />
                    Network Health Overview
                </CardTitle>
                <CardDescription>Visual representation of network traffic and potential threats. Updates dynamically.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 h-[280px] md:h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsBarChart data={networkHealthData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                     <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
                     <YAxis stroke="hsl(var(--foreground))" fontSize={10} tickLine={false} axisLine={false} />
                     <Tooltip
                       wrapperStyle={{ outline: "none" }}
                       contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', padding: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}}
                       labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}
                       itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '11px' }}
                       cursor={{fill: 'hsl(var(--muted))'}}
                     />
                     <Bar dataKey="value" name="Events" radius={[4, 4, 0, 0]} />
                   </RechartsBarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
