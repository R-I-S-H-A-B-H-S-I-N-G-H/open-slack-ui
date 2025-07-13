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
import { login as authenticate, signup } from "../../api/authApi"
import { saveJwt, validateSessionJWT } from "@/utils/jwtUtil";
import { useNavigate } from "react-router";


export default function SignUp() {
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

    async function signUp() {
        if (!userCred.password || !userCred.username) {
            toast.warning(`Username and password needed for signup`);
            return;
        }
        try {
            await signup(
                userCred.username,
                userCred.password
            );
            const res = await authenticate(userCred.username, userCred.password);
            saveJwt(res.jwt);
            toast.success("Account created successfully!");
            // Redirect to home page after successful signup
            navigate("/");
        } catch (e) {
            console.log("error");
            toast.error("Username or password is invalid");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Create your Open Slack account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await signUp();
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
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
                        <Button type="submit" className="mt-2 w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-center">
                    <span className="text-xs text-muted-foreground">
                        Already have an account?
                    </span>
                    <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => navigate("/signin")}
                    >
                        Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
