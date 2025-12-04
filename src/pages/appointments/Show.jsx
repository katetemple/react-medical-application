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

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{appointment.appointment_date}</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <b>Doctor:</b> {appointment.doctor_id}
        </CardContent>
        <CardContent>
          <b>Patient:</b> {appointment.patient_id}
        </CardContent>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
    </>
  );
}
