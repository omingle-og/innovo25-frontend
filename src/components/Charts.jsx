// import React from 'react';
// import { Line, Pie } from 'react-chartjs-2';
//
// export default function Charts({
//     barChartData,
//     scopePieChartData,
//     unitPieChartData,
//     chartOptions,
//     pieChartOptions,
//     unitPieChartOptions
// }) {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="h-96">
//                     <Line data={barChartData} options={chartOptions} />
//                 </div>
//             </div>
//
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="h-96">
//                     <Pie data={scopePieChartData} options={pieChartOptions} />
//                 </div>
//             </div>
//
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="h-96">
//                     <Pie data={unitPieChartData} options={unitPieChartOptions} />
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from 'react';
import { Line, Pie } from 'react-chartjs-2';

export default function Charts({
    barChartData,
    scopePieChartData,
    unitPieChartData,
    chartOptions,
    pieChartOptions,
    unitPieChartOptions
}) {
    return (
        <div className="space-y-6">
            {/* Line Chart (Full Width) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-96">
                    <Line data={barChartData} options={chartOptions} />
                </div>
            </div>

            {/* Pie Charts (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="h-96">
                        <Pie data={scopePieChartData} options={pieChartOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="h-96">
                        <Pie data={unitPieChartData} options={unitPieChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
