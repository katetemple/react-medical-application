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

import { IconUserFilled, IconMail, IconPhone } from "@tabler/icons-react";

export default function Show() {
  const [doctor, setDoctor] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const options = {
        method: "GET",
        url: `/appointments`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setAppointments(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      const options = {
        method: "GET",
        url: `/patients`,
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

  const doctorAppointments = appointments.filter(appointment => Number(appointment.doctor_id) === doctor.id);

  return (
    <>
    <CardTitle className="text-lg border-b border-gray-300">Doctor Details</CardTitle>
      <Card className="w-full max-w-md border-none shadow-none">
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-3 rounded-4xl">
            <IconUserFilled className="text-gray-500"/>
          </div>
            <div>
              <CardTitle>Dr. {doctor.first_name} {doctor.last_name}</CardTitle>
              <CardDescription>
                {doctor.specialisation}
              </CardDescription>
            </div>
        </div>
        <div className="flex">
          <IconMail className="mr-1"/><span className="font-semibold mr-3">Email:</span> {doctor.email}
        </div>
        <div className="flex">
          <IconPhone className="mr-1"/><span className="font-semibold mr-3">Phone:</span> {doctor.phone}
        </div>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
      <CardTitle className="text-lg border-b border-gray-300">Appointments</CardTitle>
      {
        doctorAppointments.map(appointment => {

          const patient = patients.find(patient => Number(patient.id) === Number(appointment.patient_id));
          return (
            <>
              <Card className="max-w-lg">
                <div className="flex items-center justify-between px-5">
                  <div>
                    <CardDescription className="mb-2">With Patient</CardDescription>
                    <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
                  </div>
                  <div>
                    <CardDescription className="mb-2">When</CardDescription>
                    <CardTitle>{new Date(appointment.appointment_date * 1000).toLocaleDateString()}</CardTitle>
                  </div>
                </div>
              </Card>
            </>
          )
        })
      }
    </>
  );
}
