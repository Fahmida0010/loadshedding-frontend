
import type { Metadata } from "next";
import SchedulesContent from "../components/SchedulesContent";


export const metadata: Metadata = {
  title: "Load Shedding Schedules & Timings | Load Shedding",
  description: "Find daily and weekly load shedding schedules, power cut timings, and area-wise electricity disruption plans.",
  openGraph: {
    title: "Load Shedding Schedules & Timings",
    description: "Find daily and weekly load shedding schedules and power cut timings.",
    type: "website",
  },
};


export default function Page() {
  return <SchedulesContent/>;
}