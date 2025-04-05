import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authentication-context";
export default function HomePage() {
    const { currentUser, logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is a protected route. You should be logged in to see this.</p>
            <Button className="mt-4" onClick={handleLogout}>
                LOGOUT
            </Button>
        </div>
    );
}