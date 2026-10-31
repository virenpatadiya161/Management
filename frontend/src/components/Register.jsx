import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();

        const form = e.target;

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.value,
                    email: form.email.value,
                    password: form.password.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful! Please login.");
            navigate("/login");
        } catch {
            alert("Backend is not running!");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 pt-16">
            <form onSubmit={handleRegister} className="mx-auto max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Register</h2>

                <input name="name" placeholder="Name" className="w-full rounded border p-2" required />
                <input name="email" type="email" placeholder="Email" className="w-full rounded border p-2" required />
                <input name="password" type="password" placeholder="Password (minimum 8 characters)" minLength={8} className="w-full rounded border p-2" required />

                <button className="w-full rounded bg-blue-600 p-2 text-white">Register</button>

                <p>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
                <Link to="/" className="text-blue-600">Home</Link>
            </form>
        </div>
    );
}