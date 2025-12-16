import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "@/config/api";
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
    IconCirclePlusFilled,
    IconStethoscope,
    IconUser

 } from "@tabler/icons-react";

export default function Home() {
    const { token } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

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

    if (token) {
        return (
            <>
                <CardDescription>Clinic Overview</CardDescription>
                <div className="flex gap-5">
                    <Card className="w-full max-w-60 gap-4">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center"><IconStethoscope className="w-5 mr-2 text-chart-3 rounded-md "/>Available Doctors</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {doctors.length}
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-60 gap-4">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center"><IconStethoscope className="w-5 mr-2 text-primary rounded-md "/>Patients</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {patients.length}
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }

    

    return (
        <>
            {showLogin ? (
                <LoginForm onSwitch={() => setShowLogin(false)} />
            ) : (
                <RegisterForm onSwitch={() => setShowLogin(true)} />
            )}



            {/* {!token && (
                <div className="flex gap-8">
                <LoginForm />
                <RegisterForm />
                </div>
                )} */}

        </>
    );
};