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
  const [patients, setPatients] = useState([]);
  const { token } = useAuth();

  const navigate = useNavigate();
  

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

  // includes handling cascade deletes, if a patient is deleted and has appointments, prescriptions, diagnoses, they also get deleted
  const onDeleteCallback = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const authHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [appointmentsRes, prescriptionsRes, diagnosesRes] = await Promise.all([
        axios.get("/appointments", authHeaders),
        axios.get("/prescriptions", authHeaders),
        axios.get("/diagnoses", authHeaders),
      ]);

      const appointments = appointmentsRes.data.filter(
        appointment => Number(appointment.patient_id) === Number(id)
      );
      const prescriptions = prescriptionsRes.data.filter(
        prescription => Number(prescription.patient_id) === Number(id)
      );
      const diagnoses = diagnosesRes.data.filter(
        diagnosis => Number(diagnosis.patient_id) === Number(id)
      );

      // delete these FIRST
      await Promise.all(
        prescriptions.map(prescription => 
          axios.delete(`/prescriptions/${prescription.id}`, authHeaders)
        ),
      )
      await Promise.all(
        appointments.map(appointment => 
          axios.delete(`/appointments/${appointment.id}`, authHeaders)
        ),
      )
      await Promise.all(
        diagnoses.map(diagnosis => 
          axios.delete(`/diagnoses/${diagnosis.id}`, authHeaders)
        ),
      )
      
      await axios.delete(`/patients/${id}`, authHeaders)

      setPatients(patients.filter(patient => patient.id !== id));
      toast.success("Patient deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete patient");
    }
  
  };

  return (
    <>
    
      <Button asChild variant='outline' className='mb-4 mr-auto block bg-primary text-white'>
        <Link size='sm' to={`/patients/create`} className="flex items-center">
          <IconCirclePlusFilled/>Create New Patient
        </Link>
      </Button>

    <Table>
      <TableCaption>A list of all patients.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Date of Birth</TableHead>
          <TableHead>Address</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.first_name} {patient.last_name}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>{new Date(patient.date_of_birth * 1000).toLocaleDateString()}</TableCell>
            <TableCell>{patient.address}</TableCell>

            { token &&<TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/patients/${patient.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/patients/${patient.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="patients" id={patient.id} />
              </div>

            </TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
