import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-[#457b9d] to-[#1d3557] flex items-center justify-center p-4">
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout