import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import {
  Link,
  useNavigate
} from "react-router-dom"

import {
  collection,
  getDocs
} from "firebase/firestore"

import {
  onAuthStateChanged
} from "firebase/auth"

import { db, auth } from "../firebase"

function History() {

  const navigate = useNavigate()

  const [reports, setReports] =
    useState([])

  const [emiReports, setEmiReports] =
    useState([])

  const [
    eligibilityReports,
    setEligibilityReports
  ] = useState([])

  const [loading, setLoading] =
    useState(true)

  // Fetch Reports
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (user) => {

          // User Logged Out
          if (!user) {

            navigate("/login")

            return

          }

          try {

            const currentUser =
              user.email

            // -------------------------
            // Loan Feasibility Reports
            // -------------------------

            const reportSnapshot =
              await getDocs(

                collection(
                  db,
                  "reports"
                )

              )

            const reportData =
              reportSnapshot.docs.map(
                (doc) => ({

                  id: doc.id,
                  ...doc.data()

                })
              )

            const filteredReports =
              reportData.filter(

                (report) =>

                  report.userEmail ===
                  currentUser

              )

            setReports(
              filteredReports
            )

            // -------------------------
            // EMI Reports
            // -------------------------

            const emiSnapshot =
              await getDocs(

                collection(
                  db,
                  "emiReports"
                )

              )

            const emiData =
              emiSnapshot.docs.map(
                (doc) => ({

                  id: doc.id,
                  ...doc.data()

                })
              )

            const filteredEmi =
              emiData.filter(

                (report) =>

                  report.userEmail ===
                  currentUser

              )

            setEmiReports(
              filteredEmi
            )

            // -------------------------
            // Eligibility Reports
            // -------------------------

            const eligibilitySnapshot =
              await getDocs(

                collection(
                  db,
                  "eligibilityReports"
                )

              )

            const eligibilityData =
              eligibilitySnapshot.docs.map(
                (doc) => ({

                  id: doc.id,
                  ...doc.data()

                })
              )

            const filteredEligibility =
              eligibilityData.filter(

                (report) =>

                  report.userEmail ===
                  currentUser

              )

            setEligibilityReports(
              filteredEligibility
            )

            // Stop Loading
            setLoading(false)

          }

          catch (error) {

            console.log(error)

            setLoading(false)

          }

        }

      )

    return () =>
      unsubscribe()

  }, [navigate])

  // Loading Screen
  if (loading) {

    return (

      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-6 text-xl text-slate-300">

            Loading Financial Reports...

          </p>

        </div>

      </div>

    )

  }

  return (

    <div className="bg-slate-950 min-h-screen text-white p-6 md:p-10">

      {/* Back */}
      <Link to="/">

        <button className="mb-8 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition">

          ← Back

        </button>

      </Link>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >

        <h1 className="text-5xl font-bold text-cyan-400">

          Financial Report History

        </h1>

        <p className="text-slate-400 mt-5 text-lg">

          View saved financial analysis,
          eligibility screening and EMI planning reports.

        </p>

      </motion.div>

      {/* Loan Reports */}
      <div className="mt-16">

        <h2 className="text-3xl font-bold text-cyan-400">

          Loan Feasibility Reports

        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {reports.length === 0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center md:col-span-2">

              <h3 className="text-2xl font-bold text-cyan-400">

                No Loan Reports Found

              </h3>

              <p className="text-slate-400 mt-4">

                Your saved loan feasibility reports will appear here.

              </p>

            </div>

          )}

          {reports.map((report) => (

            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >

              <h3 className="text-2xl font-bold text-cyan-400">

                {report.loanType} Loan

              </h3>

              <div className="mt-6 space-y-4 text-lg">

                <p>
                  Salary:
                  {" "}
                  ₹{report.salary}
                </p>

                <p>
                  Loan Amount:
                  {" "}
                  ₹{report.loanAmount}
                </p>

                <p>
                  EMI:
                  {" "}
                  ₹{report.emi}
                </p>

                <p>
                  Approval:
                  {" "}
                  {report.approval}%
                </p>

                <p>
                  Risk:
                  {" "}
                  {report.risk}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

      {/* Eligibility Reports */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold text-cyan-400">

          Eligibility Reports

        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {eligibilityReports.length === 0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center md:col-span-2">

              <h3 className="text-2xl font-bold text-cyan-400">

                No Eligibility Reports Found

              </h3>

              <p className="text-slate-400 mt-4">

                Your saved eligibility reports will appear here.

              </p>

            </div>

          )}

          {eligibilityReports.map((report) => (

            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >

              <h3 className="text-2xl font-bold text-cyan-400">

                {report.loanType}

              </h3>

              <div className="mt-6 space-y-4 text-lg">

                <p>
                  Salary:
                  {" "}
                  ₹{report.salary}
                </p>

                <p>
                  Credit Score:
                  {" "}
                  {report.creditScore}
                </p>

                <p>
                  Eligibility Score:
                  {" "}
                  {report.readinessScore}/100
                </p>

                <p>
                  Financial Health:
                  {" "}
                  {report.health}
                </p>

                <p>
                  Eligible Amount:
                  {" "}
                  ₹{report.eligibleLoan}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

      {/* EMI Reports */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold text-cyan-400">

          EMI Planning Reports

        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {emiReports.length === 0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center md:col-span-2">

              <h3 className="text-2xl font-bold text-cyan-400">

                No EMI Reports Found

              </h3>

              <p className="text-slate-400 mt-4">

                Your saved EMI planning reports will appear here.

              </p>

            </div>

          )}

          {emiReports.map((report) => (

            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >

              <h3 className="text-2xl font-bold text-cyan-400">

                EMI Planning Report

              </h3>

              <div className="mt-6 space-y-4 text-lg">

                <p>
                  Loan Amount:
                  {" "}
                  ₹{report.loanAmount}
                </p>

                <p>
                  Interest Rate:
                  {" "}
                  {report.interestRate}%
                </p>

                <p>
                  Monthly EMI:
                  {" "}
                  ₹{report.monthlyEMI}
                </p>

                <p>
                  Total Repayment:
                  {" "}
                  ₹{report.totalRepayment}
                </p>

                <p>
                  Affordability:
                  {" "}
                  {report.affordability}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  )

}

export default History