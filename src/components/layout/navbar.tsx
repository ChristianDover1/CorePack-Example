"use client"

import React from "react";
import Link from "next/link";
import classes from "./navbar.module.css";
import { useSession, signOut } from "next-auth/react";

export default function Navbar(){
    const { data: session } = useSession() as any;

    return (
        <nav className={classes.navBar}>
            <div className={classes.navContainer}>
                <Link href="/" className={classes.logoLink}>
                    <div className={classes.logoSection}>
                        <div className={classes.logoRect} />
                        <span className={classes.logoText}>CorePack</span>
                    </div>
                </Link>

                <ul className={classes.navLinks}>
                    <li>
                        <Link href="/dashboard" className={classes.navLink}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className={classes.navLink}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/Account" className={classes.navLink}>
                            Account
                        </Link>
                    </li>
                    {
                        session ? (
                            <li>
                                <button onClick={() => signOut()} className={classes.userButton}>
                                    {session.user.name}
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link href="/api/auth/signin" className={classes.signInButton}>
                                    SignIn
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};