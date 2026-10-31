import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "ADMIN";

    async function loadArticles() {
        const res = await fetch("http://localhost:5000/api/articles");
        const data = await res.json();
        setArticles(data);
    }

    useEffect(() => {
        loadArticles().catch(() => setMessage("Failed to load articles"));
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        setMessage("");

        const form = e.target;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: form.title.value,
                    content: form.content.value,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to create article");
                return;
            }

            form.reset();
            setMessage("Article created successfully!");
            await loadArticles();
        } catch {
            setMessage("Cannot connect to backend");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mx-auto flex max-w-4xl justify-between">
                <h1 className="text-2xl font-bold text-blue-600">Articles</h1>
                {!user && <Link to="/login">Login</Link>}
            </header>

            <main className="mx-auto mt-8 max-w-4xl">
                {isAdmin && (
                    <form onSubmit={handleCreate} className="mb-8 space-y-3 rounded-lg bg-white p-5 shadow">
                        <h2 className="text-xl font-bold">Create Article</h2>

                        <input
                            name="title"
                            placeholder="Article title"
                            className="w-full rounded border p-2"
                            required
                        />

                        <textarea
                            name="content"
                            placeholder="Article content"
                            className="w-full rounded border p-2"
                            rows={4}
                            required
                        />

                        <button className="rounded bg-blue-600 px-4 py-2 text-white">
                            Create Article
                        </button>
                    </form>
                )}

                {message && <p className="mb-4">{message}</p>}

                <h2 className="mb-4 text-xl font-semibold">All Articles</h2>

                <div className="space-y-4">
                    {articles.map((article) => (
                        <div key={article.id} className="rounded-lg bg-white p-5 shadow">
                            <h3 className="text-lg font-bold">{article.title}</h3>
                            <p className="mt-2 text-gray-600">{article.content}</p>
                            <p className="mt-3 text-sm text-gray-500">
                                By {article.author?.name || "Author"}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}