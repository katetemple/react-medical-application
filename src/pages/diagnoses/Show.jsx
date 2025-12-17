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
           <CardTitle className="text-lg border-b border-gray-300">Diagnosis Details</CardTitle>
            <Card className="w-full max-w-md border-none shadow-none">
              <div className="flex">
                <IconUserFilled className="mr-1"/><span className="font-semibold mr-3">Patient:</span> {patient.first_name} {patient.last_name}
              </div>
              <div className="flex">
                <IconFaceMaskFilled className="mr-1"/><span className="font-semibold mr-3">Condition:</span> {diagnoses.condition}
              </div>
              <div className="flex">
                <IconCalendarWeekFilled className="mr-1"/><span className="font-semibold mr-3">Date of Diagnosis:</span> {new Date(diagnoses.diagnosis_date * 1000).toLocaleDateString()}
              </div>
              <CardFooter className="flex-col gap-2">
              </CardFooter>
            </Card>
        
    </>
  );
}
