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
  const [doctors, setDoctors] = useState([]);
  const { token } = useAuth();

  const navigate = useNavigate();
  

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

  // handles deleting associated appointments with the deleted doctor, leaves prescriptions and diagnoses alone as they shouldnt be deleted if a doctor is deleted
  const onDeleteCallback = async (id) => {
      try {
        const token = localStorage.getItem("token");
  
        const authHeaders = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        // fetch appointments
        const appointmentsRes = await axios.get("/appointments", authHeaders);

        // filter appointments for this doctor
        const appointments = appointmentsRes.data.filter(
          appointment => Number(appointment.doctor_id) === Number(id)
        );
  
        // Delete related appointments first
        await Promise.all(
          appointments.map(appointment => 
            axios.delete(`/appointments/${appointment.id}`, authHeaders)
          ),
        )
  
        // delete doctor
        await axios.delete(`/doctors/${id}`, authHeaders)
  
        // update ui
        setDoctors(doctors.filter(doctor => doctor.id !== id));
        toast.success("Doctor deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete doctor");
      }
    
    };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block bg-primary text-white'
      ><Link size='sm' to={`/doctors/create`} className="flex items-center"><IconCirclePlusFilled/>Create New Doctor</Link>
      </Button>


    <Table>
      <TableCaption>A list of all doctors.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specialisation</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>Dr. {doctor.first_name} {doctor.last_name}</TableCell>
            <TableCell>{doctor.specialisation}</TableCell>
            <TableCell>{doctor.email}</TableCell>
            <TableCell>{doctor.phone}</TableCell>

            {/* only show if logged in */}
            { token && <TableCell> 
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="doctors" id={doctor.id} />
              </div>
              </TableCell>}

          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
