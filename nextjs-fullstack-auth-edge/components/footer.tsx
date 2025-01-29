import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        &copy; {new Date().getFullYear()} Suryabisht00. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                            About
                        </Link>
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                            Contact
                        </Link>
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                            Privacy Policy
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-6 space-x-4">
                    <a href="https://github.com/suryabisht00" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <FaGithub size={20} />
                    </a>
                    <a href="https://twitter.com/suryabisht00" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <FaTwitter size={20} />
                    </a>
                    <a href="https://linkedin.com/in/suryabisht00" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <FaLinkedin size={20} />
                    </a>
                    <a href="https://instagram.com/suryabisht00" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <FaInstagram size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
