import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

export default function Index() {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchAppointments = async () => {
      const options = {
        method: "GET",
        url: "/appointments",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setAppointments(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Appointment deleted successfully");
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  
  };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/appointments/create`}>Create New Appointment</Link>
      </Button>


    <Table>
      <TableCaption>A list of all appointments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{appointment.appointment_date}</TableCell>
            <TableCell>{appointment.patient_id}</TableCell>
            <TableCell>{appointment.doctor_id}</TableCell>
            <TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={appointment.id} />
              </div>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
