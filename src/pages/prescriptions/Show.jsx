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
  IconUserFilled,
  IconStethoscope,
  IconPillFilled,
  IconFaceMaskFilled,
} from "@tabler/icons-react";

export default function Show() {
  const [prescription, setPrescription] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescription = async () => {
      const options = {
        method: "GET",
        url: `/prescriptions/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPrescription(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescription();
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

  const doctor = doctors.find(doctor => doctor.id === prescription.doctor_id)
  const patient = patients.find(patient => patient.id === prescription.patient_id)
  const diagnosis = diagnoses.find(diagnosis => diagnosis.id === prescription.patient_id)

  if(!doctor || !patient || !diagnosis) {
    return(
      <CardTitle>Loading...</CardTitle>
    )
  }

  return (
    <>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Prescription</CardTitle>
          <CardDescription>
            Prescribed by Dr. {doctor.first_name} {doctor.last_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <IconUserFilled /><span className="font-semibold">Patient:</span> {patient.first_name} {patient.last_name}
        </CardContent>
        <CardContent className="flex items-center gap-2">
          <IconFaceMaskFilled/><span className="font-semibold">Condition:</span> {diagnosis.condition}
        </CardContent>
        <CardContent className="flex items-center gap-2">
          <IconPillFilled/><span className="font-semibold">Medication:</span> {prescription.medication} {prescription.dosage} 
        </CardContent>
        <CardContent className="flex items-center gap-2">
          <IconCalendarWeekFilled/><span className="font-semibold">Start-End Date:</span>{new Date(prescription.start_date * 1000).toLocaleDateString()}-{new Date(prescription.end_date * 1000).toLocaleDateString()}
        </CardContent>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
    </>
  );
}
