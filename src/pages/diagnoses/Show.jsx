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

export default function Show() {
  const [diagnoses, setDiagnoses] = useState(null);
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

  return (
    <>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <b>Doctor:</b> 
            </CardContent>
            <CardContent>
              <b>Patient:</b> 
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
          </Card>
        
    </>
  );
}
