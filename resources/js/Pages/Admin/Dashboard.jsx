import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
const FILTERS = ["week", "month", "year"];

export default function Dashboard({ auth, visitStats, selectedFilter }) {
    const { t } = useTranslation();

    const changeFilter = (filter) => {
        router.visit(route("admin.dashboard", { filter }));
    };

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 mx-auto max-w-7xl">
                <div className="my-2 mt-4">
                    <div className="flex gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => changeFilter(f)}
                                className={`px-4 py-2 rounded ${
                                    selectedFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {t(f)}{" "}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2">{t("site_visit_stats")}</div>{" "}
                </div>
                <ResponsiveContainer
                    width="100%"
                    height={300}
                    style={{ direction: "ltr" }}
                    className="mr-3"
                >
                    <LineChart data={visitStats}>
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, direction: "rtl" }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#428b7c"
                            strokeWidth={2}
                            dot={{ fill: "#428b7c", r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </DashboardLayout>
    );
}
