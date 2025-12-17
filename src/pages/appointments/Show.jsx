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
  IconCalendarFilled,
  IconMail,
  IconPhone
} from "@tabler/icons-react";

export default function Show() {
  const [appointment, setAppointment] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setAppointment(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointment();
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

  const doctor = doctors.find(doctor => doctor.id === appointment.doctor_id)
  const patient = patients.find(patient => patient.id === appointment.patient_id)

  if(!doctor || !patient) {
    return(
      <CardTitle>Loading...</CardTitle>
    )
  }

  return (
    <>
      <CardTitle className="text-lg border-b border-gray-300">Appointment Details</CardTitle>
      <Card className="w-full max-w-md border-none shadow-none">
        <div className="flex">
          <IconCalendarFilled className="mr-1"/><span className="font-semibold mr-3">Date:</span> {new Date(appointment.appointment_date * 1000).toLocaleDateString()}
        </div>
        <div className="flex">
          <IconUserFilled className="mr-1"/><span className="font-semibold mr-3">Patient:</span> {patient.first_name} {patient.last_name}
        </div>
        <div className="flex">
          <IconStethoscope className="mr-1"/><span className="font-semibold mr-3">Doctor:</span> {doctor.first_name} {doctor.last_name}
        </div>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
    </>
  );
}
