import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCalendarWeekFilled,
  IconFaceMaskFilled,
  IconUserFilled,
} from "@tabler/icons-react";

export default function Show() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [patients, setPatients] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const options = {
        method: "GET",
        url: `/diagnoses/${id}`,
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
  
  const patient = patients.find(patient => Number(diagnoses.patient_id) === Number(patient.id))

  // handle loading
  if(!patient) {
    return (
      <CardTitle>Loading...</CardTitle>
    )
  }

  return (
    <>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <IconUserFilled/><span className="font-semibold">Patient:</span> {patient.first_name} {patient.last_name}
            </CardContent>
            <CardContent className="flex items-center gap-2">
              <IconFaceMaskFilled/><span className="font-semibold">Condition:</span> {diagnoses.condition} 
            </CardContent>
            <CardContent className="flex items-center gap-2">
              <IconCalendarWeekFilled/><span className="font-semibold">Diagnosed on:</span>{new Date(diagnoses.diagnosis_date * 1000).toLocaleDateString()}
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
          </Card>
        
    </>
  );
}
