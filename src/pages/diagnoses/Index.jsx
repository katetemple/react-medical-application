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
  const [diagnoses, setDiagnoses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchDiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDiagnoses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDiagnoses();
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
    toast.success("Diagnosis deleted successfully");
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));

  };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/diagnoses/create`}>Create New Diagnosis</Link>
      </Button>


    <Table>
      <TableCaption>A list of all diagnoses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Date of Diagnosis</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          diagnoses.map((d) => {
            const patient = patients.find(patient => d.patient_id === patient.id);
          
            return (
              <TableRow key={d.id}>
                <TableCell>{patient.first_name} {patient.last_name}</TableCell>
                <TableCell>{d.condition}</TableCell>
                <TableCell>{new Date(d.diagnosis_date * 1000).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${d.id}`)}
                  ><Eye /></Button>
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${d.id}/edit`)}
                  ><Pencil /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={d.id} />
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
