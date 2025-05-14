
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit3, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FirewallRule {
  id: string;
  ipAddress: string;
  port: string;
  protocol: "TCP" | "UDP" | "ICMP" | string;
  action: "Allow" | "Deny" | string;
}

const initialRules: FirewallRule[] = [
  { id: "1", ipAddress: "192.168.1.100", port: "80", protocol: "TCP", action: "Allow" },
  { id: "2", ipAddress: "0.0.0.0/0", port: "22", protocol: "TCP", action: "Deny" },
  { id: "3", ipAddress: "10.0.0.5", port: "*", protocol: "ICMP", action: "Allow" },
];

export default function FirewallPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<FirewallRule[]>(initialRules);
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const [protocol, setProtocol] = useState<string>("TCP");
  const [action, setAction] = useState<string>("Allow");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ipAddress || !protocol || !action) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const newRule: FirewallRule = {
      id: editingRuleId || crypto.randomUUID(),
      ipAddress,
      port: port || "*", // Default to wildcard if port is empty
      protocol,
      action,
    };

    if (editingRuleId) {
      setRules(rules.map(rule => rule.id === editingRuleId ? newRule : rule));
      toast({ title: "Success", description: "Firewall rule updated." });
    } else {
      setRules([...rules, newRule]);
      toast({ title: "Success", description: "New firewall rule added." });
    }
    
    // Reset form
    setIpAddress("");
    setPort("");
    setProtocol("TCP");
    setAction("Allow");
    setEditingRuleId(null);
  };

  const handleEdit = (rule: FirewallRule) => {
    setEditingRuleId(rule.id);
    setIpAddress(rule.ipAddress);
    setPort(rule.port === "*" ? "" : rule.port);
    setProtocol(rule.protocol);
    setAction(rule.action);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
    toast({ title: "Success", description: "Firewall rule deleted." });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            {editingRuleId ? "Edit Firewall Rule" : "Add New Firewall Rule"}
          </CardTitle>
          <CardDescription>
            Define rules to control network traffic based on IP addresses, ports, and protocols.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address/CIDR</Label>
                <Input id="ipAddress" placeholder="e.g., 192.168.1.0/24 or Any" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="e.g., 80, 443 or *" value={port} onChange={(e) => setPort(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Select value={protocol} onValueChange={setProtocol}>
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="ICMP">ICMP</SelectItem>
                    <SelectItem value="ANY">ANY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allow">Allow</SelectItem>
                    <SelectItem value="Deny">Deny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
                {editingRuleId && <Button type="button" variant="outline" onClick={() => { setEditingRuleId(null); setIpAddress(""); setPort(""); setProtocol("TCP"); setAction("Allow");}}>Cancel Edit</Button>}
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> {editingRuleId ? "Update Rule" : "Add Rule"}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Current Firewall Rules
          </CardTitle>
          <CardDescription>List of active firewall rules.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.ipAddress}</TableCell>
                  <TableCell>{rule.port}</TableCell>
                  <TableCell>{rule.protocol}</TableCell>
                  <TableCell>
                    <Badge variant={rule.action === "Allow" ? "default" : "destructive"}
                           className={rule.action === "Allow" ? "bg-green-500 text-white" : ""}>
                        {rule.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(rule)} aria-label="Edit rule">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)} aria-label="Delete rule">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {rules.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No firewall rules configured.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

