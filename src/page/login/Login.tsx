import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { login as authenticate } from "../../api/authApi"
import { saveJwt, validateSessionJWT } from "@/utils/jwtUtil";
import { useNavigate } from "react-router";


export default function Login() {
    let navigate = useNavigate();

    useEffect(() => {
        if (validateSessionJWT()) {
            navigate("/");
        }
    },[])

    const [userCred, setUserCred] = useState({
        username: "",
        password: "",
    });

    async function login() {
        if (!userCred.password || !userCred.username) {
            toast.warning(`Username and password neede for login`)
            return;
        }
        try {
            const res = await authenticate(userCred.username, userCred.password);
            saveJwt(res.jwt)
            navigate("/")
        }
        catch (e) { 
            console.log("error");
            
            toast.error("Invalid username or password");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Sign in to Open Slack
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await login();
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                required
                                autoFocus
                                value={userCred.username}
                                onChange={(e) => {
                                    setUserCred((prev) => ({
                                        ...prev,
                                        username: e.target.value,
                                    }));
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={userCred.password}
                                onChange={(e) => {
                                    setUserCred((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }));
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="mt-2 w-full"
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-center">
                    <span className="text-xs text-muted-foreground">
                        Forgot your password?
                    </span>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                        Reset Password
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
