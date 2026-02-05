"use client";
import { useUserContext } from "./UserContext";

export default function UserDetails({ onBack }) {
    const { userDetails } = useUserContext();

    if (!userDetails) return null;

    return (
        <div>
            <h2>User Details</h2>
            <p><b>Name:</b> {userDetails.name}</p>
            <p><b>Email:</b> {userDetails.email}</p>
            <p><b>Address:</b> {userDetails.address}</p>

            <button onClick={onBack}>Back</button>
        </div>
    );
}
