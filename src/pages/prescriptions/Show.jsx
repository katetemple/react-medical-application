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
  const diagnosis = diagnoses.find(diagnosis => diagnosis.id === prescription.diagnosis_id)

  if(!doctor || !patient || !diagnosis) {
    return(
      <CardTitle>Loading...</CardTitle>
    )
  }

  return (
    <>

      <CardTitle className="text-lg border-b border-gray-300">Prescription Details</CardTitle>
      <Card className="w-full max-w-md border-none shadow-none">
        <div className="flex">
          <IconUserFilled className="mr-1"/><span className="font-semibold mr-3">Patient:</span> {patient.first_name} {patient.last_name}
        </div>
        <div className="flex">
          <IconFaceMaskFilled className="mr-1"/><span className="font-semibold mr-3">Condition:</span> {diagnosis.condition}
        </div>
        <div className="flex">
          <IconPillFilled className="mr-1"/><span className="font-semibold mr-3">Medication:</span> {prescription.medication} {prescription.dosage}
        </div>
        <div className="flex">
          <IconCalendarWeekFilled className="mr-1"/><span className="font-semibold mr-3">Dosage Schedule:</span> {new Date(prescription.start_date * 1000).toLocaleDateString()}-{new Date(prescription.end_date * 1000).toLocaleDateString()}
        </div>
        <CardFooter className="flex-col gap-2">
          <CardDescription>
            Prescribed by Dr. {doctor.first_name} {doctor.last_name}
          </CardDescription>
        </CardFooter>
      </Card>
    </>
  );
}
