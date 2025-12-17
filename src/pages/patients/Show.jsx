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

import { IconUserFilled, IconMail, IconPhone, IconCalendarFilled, IconHome, IconFileText } from "@tabler/icons-react";

export default function Show() {
  const [patient, setPatient] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPatient = async () => {
      const options = {
        method: "GET",
        url: `/patients/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatient(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatient();
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
      const fetchPrescriptions = async () => {
        const options = {
          method: "GET",
          url: `/prescriptions`,
          headers: {
              Authorization: `Bearer ${token}`
          }
        };
  
        try {
          let response = await axios.request(options);
          console.log(response.data);
          setPrescriptions(response.data);
        } catch (err) {
          console.log(err);
        }
      };
  
      fetchPrescriptions();
    }, []);

    useEffect(() => {
      const fetchDiagnoses = async () => {
        const options = {
          method: "GET",
          url: `/diagnoses`,
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
            url: `/doctors`,
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

  const patientAppointments = appointments.filter(appointment => Number(appointment.patient_id) === patient.id);
  const patientDiagnoses = diagnoses.filter(diagnosis => Number(diagnosis.patient_id) === patient.id);
  const patientPrescriptions = prescriptions.filter(prescription => Number(prescription.patient_id) === patient.id);

  return (
    <>
      <CardTitle className="text-lg border-b border-gray-300">Patient Details</CardTitle>
      <Card className="w-full max-w-md border-none shadow-none">
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-3 rounded-4xl">
            <IconUserFilled className="text-gray-500"/>
          </div>
            <div>
              <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
            </div>
        </div>
        <div className="flex">
          <IconCalendarFilled className="mr-1"/><span className="font-semibold mr-3">Date of Birth:</span> {new Date(patient.date_of_birth * 1000).toLocaleDateString()}
        </div>
        <div className="flex">
          <IconMail className="mr-1"/><span className="font-semibold mr-3">Email:</span> {patient.email}
        </div>
        <div className="flex">
          <IconPhone className="mr-1"/><span className="font-semibold mr-3">Phone:</span> {patient.phone}
        </div>
        <div className="flex">
          <IconHome className="mr-1"/><span className="font-semibold mr-3">Address:</span> {patient.address}
        </div>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
      <CardTitle className="text-lg border-b border-gray-300">Appointments</CardTitle>
      {
        patientAppointments.map(appointment => {

          const doctor = doctors.find(doctor => Number(doctor.id) === Number(appointment.doctor_id));
          return (
            <>
              <Card className="max-w-lg">
                <div className="flex items-center justify-between px-5">
                  <div>
                    <CardDescription className="mb-2">With Doctor</CardDescription>
                    <CardTitle>Dr. {doctor.first_name} {doctor.last_name}</CardTitle>
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

      <CardTitle className="text-lg border-b border-gray-300">Diagnoses</CardTitle>
      {
        patientDiagnoses.map(diagnosis => {

          // const doctor = doctors.find(doctor => Number(doctor.id) === Number(appointment.doctor_id));
          return (
            <>
              <Card className="max-w-lg bg-orange-100">
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center">
                    <IconFileText className="text-chart-1"/><CardTitle><span className="text-gray-600 text-sm">Diagnosed with:</span> {diagnosis.condition}</CardTitle>
                  </div>
                  <div>
                    <CardTitle><span className="text-gray-600 text-sm">On:</span> {new Date(diagnosis.diagnosis_date * 1000).toLocaleDateString()}</CardTitle>
                  </div>
                </div>
              </Card>
            </>
          )
        })
      }

      <CardTitle className="text-lg border-b border-gray-300">Prescriptions</CardTitle>
      {
        patientPrescriptions.map(prescription => {

          const doctor = doctors.find(doctor => Number(doctor.id) === Number(prescription.doctor_id));
          return (
            <>
              <Card className="max-w-sm bg-blue-100">
                <div className="flex items-center justify-between px-5">
                  <div>
                    <CardDescription className="mb-2">Medication</CardDescription>
                    <CardTitle>{prescription.medication}</CardTitle>
                  </div>
                  <div>
                    <CardDescription className="mb-2">Dosage</CardDescription>
                    <CardTitle>{prescription.dosage}</CardTitle>
                  </div>
                </div>
                <div className="px-5">
                  <CardDescription className="mb-2">Dosage Schedule</CardDescription>
                  <CardTitle>{new Date(prescription.start_date * 1000).toLocaleDateString()} - {new Date(prescription.end_date * 1000).toLocaleDateString()}</CardTitle>
                </div>
                <CardDescription className="px-5">Prescribed by: Dr. {doctor.first_name} {doctor.last_name}</CardDescription>
              </Card>
            </>
          )
        })
      }
    </>
  );
}
