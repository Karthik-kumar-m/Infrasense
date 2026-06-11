"use client";

import { useMemo, useState } from "react";
import { Flame, Trophy, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TicketStatus = "Open" | "In Progress" | "Resolved";

type Ticket = {
  id: string;
  reporter: string;
  zone: string;
  status: TicketStatus;
  description: string;
  category: "IT" | "Plumbing" | "Electrical";
  isVerified: boolean;
};

const CATEGORY_WEIGHTS: Record<Ticket["category"], number> = {
  IT: 1,
  Plumbing: 2,
  Electrical: 3,
};

const BASE_POINTS = 10;

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "CF-101",
    reporter: "Aarav",
    zone: "Block A",
    status: "Open",
    description: "Projector in seminar hall not turning on",
    category: "IT",
    isVerified: true,
  },
  {
    id: "CF-102",
    reporter: "Nisha",
    zone: "Library",
    status: "In Progress",
    description: "Leaking water fountain on first floor",
    category: "Plumbing",
    isVerified: true,
  },
  {
    id: "CF-103",
    reporter: "Rahul",
    zone: "Block B",
    status: "Open",
    description: "Sparking near switchboard in lab",
    category: "Electrical",
    isVerified: false,
  },
];

const buildingMap: Record<string, { floors: string[]; rooms: string[] }> = {
  "Block A": { floors: ["Ground", "1"], rooms: ["A-101", "A-102", "A-103"] },
  "Block B": { floors: ["Ground", "1"], rooms: ["B-201", "B-202"] },
  Library: { floors: ["Ground", "1"], rooms: ["L-Reading", "L-Archives"] },
};

const zoneToPath: Record<string, string> = {
  "Block A": "zone-block-a",
  "Block B": "zone-block-b",
  Library: "zone-library",
};

function calculatePoints(category: Ticket["category"], isVerified: boolean) {
  return BASE_POINTS + CATEGORY_WEIGHTS[category] * Number(isVerified);
}

function getZoneColor(activeCount: number) {
  const capped = Math.min(activeCount, 5);
  const ratio = capped / 5;

  const red = Math.round(34 + ratio * (127 - 34));
  const green = Math.round(197 + ratio * (29 - 197));
  const blue = Math.round(94 + ratio * (29 - 94));

  return `rgb(${red}, ${green}, ${blue})`;
}

function CampusHeatmap({ tickets }: { tickets: Ticket[] }) {
  const zoneCounts = tickets
    .filter((ticket) => ticket.status !== "Resolved")
    .reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.zone] = (acc[ticket.zone] ?? 0) + 1;
      return acc;
    }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campus Heatmap</CardTitle>
        <CardDescription>Green (low) to dark red (high) active issue density.</CardDescription>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 420 200" className="w-full rounded-md border border-slate-200 bg-slate-50 p-3">
          {Object.entries(zoneToPath).map(([zone, pathId], index) => {
            const x = 20 + index * 130;
            const count = zoneCounts[zone] ?? 0;
            return (
              <g key={zone}>
                <rect
                  id={pathId}
                  x={x}
                  y={40}
                  rx={10}
                  width={110}
                  height={90}
                  fill={getZoneColor(count)}
                  stroke="#1e293b"
                />
                <text x={x + 55} y={75} textAnchor="middle" className="fill-white text-[10px] font-semibold">
                  {zone}
                </text>
                <text x={x + 55} y={95} textAnchor="middle" className="fill-white text-[10px]">
                  {count} Active
                </text>
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}

function Leaderboard({ tickets }: { tickets: Ticket[] }) {
  const points = tickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.reporter] =
      (acc[ticket.reporter] ?? 0) + calculatePoints(ticket.category, ticket.isVerified);
    return acc;
  }, {});

  const rows = Object.entries(points)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Gamification Leaderboard
        </CardTitle>
        <CardDescription>P = B + (Wc * S), where B = 10 and S = 0 or 1.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
            >
              <span className="text-sm font-medium">
                #{index + 1} {row.name}
              </span>
              <Badge variant="secondary">{row.total} pts</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanBoard({ tickets }: { tickets: Ticket[] }) {
  const columns: TicketStatus[] = ["Open", "In Progress", "Resolved"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Kanban</CardTitle>
        <CardDescription>Track ticket progress across operational states.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="mb-3 text-sm font-semibold text-slate-700">{column}</p>
              <div className="space-y-2">
                {tickets
                  .filter((ticket) => ticket.status === column)
                  .map((ticket) => (
                    <div key={ticket.id} className="rounded-md border border-slate-200 bg-white p-2 text-xs">
                      <p className="font-semibold">{ticket.id}</p>
                      <p>{ticket.description}</p>
                      <p className="mt-1 text-slate-500">{ticket.category}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StudentForm({ onSubmit }: { onSubmit: (ticket: Ticket) => void }) {
  const [description, setDescription] = useState("");
  const [assetPayload, setAssetPayload] = useState("Asset_ID: WP-04");
  const [building, setBuilding] = useState("Block A");
  const [floor, setFloor] = useState(buildingMap["Block A"].floors[0]);
  const [room, setRoom] = useState(buildingMap["Block A"].rooms[0]);

  const floorOptions = buildingMap[building].floors.map((value) => ({ value, label: value }));
  const roomOptions = buildingMap[building].rooms.map((value) => ({ value, label: value }));

  const submitForm = () => {
    if (!description.trim()) {
      return;
    }

    onSubmit({
      id: `CF-${Math.floor(Math.random() * 900 + 100)}`,
      reporter: "You",
      zone: building,
      status: "Open",
      description,
      category: /water|leak/i.test(description)
        ? "Plumbing"
        : /spark|light|switch/i.test(description)
          ? "Electrical"
          : "IT",
      isVerified: false,
    });

    setDescription("");
    setAssetPayload("Asset_ID: WP-04");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Report an Issue
        </CardTitle>
        <CardDescription>Mobile-friendly reporting with QR auto-detection and fallback location selection.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Image Upload</label>
          <Input type="file" accept="image/*" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Issue Description</label>
          <Textarea
            placeholder="Describe the issue"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">QR Payload</label>
          <Input value={assetPayload} onChange={(event) => setAssetPayload(event.target.value)} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Building</label>
            <Select
              value={building}
              onChange={(event) => {
                const nextBuilding = event.target.value;
                setBuilding(nextBuilding);
                setFloor(buildingMap[nextBuilding].floors[0]);
                setRoom(buildingMap[nextBuilding].rooms[0]);
              }}
              options={Object.keys(buildingMap).map((value) => ({ value, label: value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Floor</label>
            <Select value={floor} onChange={(event) => setFloor(event.target.value)} options={floorOptions} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Room</label>
            <Select value={room} onChange={(event) => setRoom(event.target.value)} options={roomOptions} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-xs text-slate-600">
          <span>Resolved Location</span>
          <span>{`${building} / Floor ${floor} / ${room}`}</span>
        </div>

        <Button onClick={submitForm} className="w-full">
          Submit Ticket
        </Button>
      </CardContent>
    </Card>
  );
}

export function CampusFixDashboard() {
  const [view, setView] = useState<"Student" | "Admin">("Student");
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const summary = useMemo(
    () => ({
      active: tickets.filter((ticket) => ticket.status !== "Resolved").length,
      resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
    }),
    [tickets]
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <header className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CampusFix</h1>
            <p className="text-sm text-slate-600">AI-powered smart campus issue tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="gap-1" variant="secondary">
              <Flame className="h-3.5 w-3.5" /> {summary.active} Active
            </Badge>
            <Button
              variant={view === "Student" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("Student")}
            >
              Student Dashboard
            </Button>
            <Button
              variant={view === "Admin" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("Admin")}
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      </header>

      {view === "Student" ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <StudentForm onSubmit={(ticket) => setTickets((prev) => [ticket, ...prev])} />
          <Leaderboard tickets={tickets} />
        </div>
      ) : (
        <div className="grid gap-6">
          <KanbanBoard tickets={tickets} />
          <CampusHeatmap tickets={tickets} />
          <Card>
            <CardHeader>
              <CardTitle>Ops Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Resolved Tickets: <span className="font-semibold text-slate-900">{summary.resolved}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
