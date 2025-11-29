import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
    const [form, setForm] = useState({
        appointment_date: "",
        patient_id: "",
        doctor_id: "",
    });
    const navigate = useNavigate();
    const { token } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value,
            // doctor_id: Number(form.doctor_id),
            // patient_id: Number(form.patient_id),
        });
    };

    const createAppointment = async () => {

        const options = {
            method: "POST",
            url: `/appointments`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/appointments', { state: { 
                type: 'success',
                message: `Appointment created successfully` 
            }});
        } catch (err) {
            // console.log(err);
            console.log("BACKEND ERROR:", err.response?.data);
    console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
        }

    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createAppointment();
    };

  return (
    <>
        <h1>Create a new Appointment</h1>
        <form onSubmit={handleSubmit}>
            <Input 
                type="date" 
                placeholder="Appointment Date" 
                name="appointment_date" 
                value={form.appointment_date} 
                onChange={handleChange} 
            />
            <select
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                className="mt-2 border rounded-md p-2 w-full"
            >
                <option value="" disabled hidden className="text-gray-400">Patient</option>
                {patients.map((patient) => {
                    return(
                        <option key={patient.id} value={patient.id}>{patient.first_name} {patient.last_name}</option>
                    )
                })}
            </select>
            <select
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
                className="mt-2 border rounded-md p-2 w-full"
            >
                <option value="" disabled hidden className="text-gray-400">Doctor</option>
                {doctors.map((doctor) => {
                    return(
                        <option key={doctor.id} value={doctor.id}>{doctor.first_name} {doctor.last_name}</option>
                    )
                })}
            </select>
            {/* <select
                name="specialisation"
                value={form.specialisation}
                onChange={handleChange}
                className="mt-2 border rounded-md p-2 w-full"
            >
                <option value="" disabled hidden className="text-gray-400">Specialisation</option>
                <option value="Podiatrist">Podiatrist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="General Practitioner">General Practitioner</option>
            </select> */}
            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit" 
            >Submit</Button>
        </form>
    </>
  );
}