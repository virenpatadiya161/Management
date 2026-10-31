import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        const form = e.target;

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email.value,
                    password: form.password.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");
            navigate("/");
        } catch {
            alert("Backend is not running!");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 pt-16">
            <form onSubmit={handleLogin} className="mx-auto max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Login</h2>

                <input name="email" type="email" placeholder="Email" className="w-full rounded border p-2" required />
                <input name="password" type="password" placeholder="Password" className="w-full rounded border p-2" required />

                <button className="w-full rounded bg-blue-600 p-2 text-white">Login</button>

                <p>Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
                <Link to="/" className="text-blue-600">Home</Link>
            </form>
        </div>
    );
}