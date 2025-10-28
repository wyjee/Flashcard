'use client'
import React, {useState} from 'react';
// import {
//     LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts';
// import ImportToeflButton from "../common/ImportToeflButton";
//
interface StudyAnalyticsProps {
    user: any;
}

//
const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({user}) => {
//     const [studyData, setStudyData] = useState([
//         {date: 'Mon', hours: 2},
//         {date: 'Tue', hours: 1},
//         {date: 'Wed', hours: 3},
//         {date: 'Thu', hours: 2},
//         {date: 'Fri', hours: 4},
//         {date: 'Sat', hours: 5},
//         {date: 'Sun', hours: 0},
//     ]);
//
//     const [categoryData, setCategoryData] = useState([
//         {name: 'Security', value: 8},
//         {name: 'Development', value: 6},
//         {name: 'DevOps', value: 3},
//     ]);
//
//     const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
//     const totalHours = studyData.reduce((sum, d) => sum + d.hours, 0);
//
    return (<></>
//         <section className="bg-white shadow-md rounded-md p-4 mb-6">
//             <h2 className="text-xl font-semibold mb-2">📊 학습 분석</h2>
//             <p className="text-sm text-gray-500 mb-4">
//                 {user ? `${user.name}님의 이번 주 학습 시간: ${totalHours}시간` : `로그인 후 데이터를 확인하세요.`}
//             </p>
//
//             <div className="flex items-center gap-3 mb-4">
//                 <ImportToeflButton/>
//             </div>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="h-64">
//                     <h3 className="text-md font-medium mb-2">📅 일별 학습 시간</h3>
//                     <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={studyData}>
//                             <XAxis dataKey="date"/>
//                             <YAxis/>
//                             <Tooltip/>
//                             <Line type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={2}/>
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//
//                 <div className="h-64">
//                     <h3 className="text-md font-medium mb-2">🧠 분야별 학습 비율</h3>
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                             <Pie
//                                 data={categoryData}
//                                 dataKey="value"
//                                 nameKey="name"
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 label
//                             >
//                                 {categoryData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
//                                 ))}
//                             </Pie>
//                             <Tooltip/>
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </section>
    );
};
//
export default StudyAnalytics;