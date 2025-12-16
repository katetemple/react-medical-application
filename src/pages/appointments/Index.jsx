import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

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
import { IconCirclePlusFilled } from "@tabler/icons-react";

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
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchAppointments = async () => {
      const options = {
        method: "GET",
        url: "/appointments",
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "/doctors",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      const options = {
        method: "GET",
        url: "/patients",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
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
        className='mb-4 mr-auto block bg-primary text-white'
      ><Link size='sm' to={`/appointments/create`} className="flex items-center"><IconCirclePlusFilled/>Create New Appointment</Link>
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
        {
          appointments.map((appointment) => {

            const doctor = doctors.find(doctor => Number(appointment.doctor_id) === doctor.id);
            const patient = patients.find(patient => Number(appointment.patient_id) === patient.id);

            // handles loading times so page doesnt break
            if(!patient || !doctor) {
              return(
                <TableRow key={appointment.id}>
                  <TableCell colSpan={7}>Loading...</TableCell>
                </TableRow>
              );
            }
          
            return (
              <TableRow key={appointment.id}>
                <TableCell>{new Date(appointment.appointment_date * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{patient.first_name} {patient.last_name}</TableCell>
                <TableCell>Dr. {doctor.first_name} {doctor.last_name}</TableCell>
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
            )
        })
        }
      </TableBody>
    </Table>
    </>
  );
}
