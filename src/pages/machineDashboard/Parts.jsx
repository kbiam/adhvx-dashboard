import React from 'react'

function Parts() {
  return (
    <>
                        {/* Top Row - 3 Equal Cards */}
                        <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Maintenance Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32">
                        <CircularProgressbar
                        value={75}
                        text={`${machine.serviceTime}h`}
                        styles={buildStyles({
                            textSize: '16px',
                            pathColor: `rgba(62, 152, 199, ${75 / 100})`,
                            textColor: isDark ? '#cdcdcd' : '#333',
                            trailColor: isDark ? '#1f1f1f' : '#e6e6e6',
                            pathTransitionDuration: 0.5,
                        })}
                        />
                        <p className="text-center mt-2 text-sm text-gray-500">Service Time</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Maintenance Items</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-2">
                    {machine.maintenanceItems.map((item) => (
                        <div key={item.id} className="flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-700">
                        <div 
                            className={`w-3 h-3 rounded-full mr-2 ${
                            item.type === 'primary' ? 'bg-blue-500' : 
                            item.type === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                        />
                        <span className="text-sm truncate">{item.name}</span>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2 border-dashed">
                        <Plus size={16} className="mr-2" />
                        <span className="text-sm">Add Parameters</span>
                    </Button>
                    </div>
                </CardContent>
                </Card>

                <Card className="shadow-sm">
                <CardHeader className=''>
                    <CardTitle className="text-lg">Reminder</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <div className="space-y-2">
                    {machine.urgentRecalls.map((recall, index) => (
                        <div key={index} className="grid grid-cols-3 text-sm p-1">
                        <div className="text-gray-800 dark:text-gray-200 truncate">Urgent Safety Recall</div>
                        <div className="text-gray-500 truncate">{recall.dueDate}</div>
                        <div className="text-gray-500 truncate">{recall.completionDate}</div>
                        </div>
                    ))}
                    <Button size="sm" className="mt-2 bg-mainBlue hover:bg-blue-700 text-white">
                        <Plus size={14} className="mr-1" />
                        Add New
                    </Button>
                    </div>
                </CardContent>
                </Card>

                {/* Full Width Card */}
                <Card className="shadow-sm md:col-span-3">
                <CardHeader>
                    <CardTitle className="text-lg">Consumables</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {machine.consumables.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="mb-2">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {item.name.includes("Coolant") && (
                                <path d="M12 5C8.5 5 5 8.5 5 12C5 15.5 8.5 19 12 19C15.5 19 19 15.5 19 12C19 8.5 15.5 5 12 5Z" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Resin") && (
                                <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Carbon") && (
                                <path d="M7 22H17 M12 2V6 M8 6H16V14C16 16.2091 14.2091 18 12 18C9.79086 18 8 16.2091 8 14V6Z" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Wire") && (
                                <path d="M9 2V22 M15 2V22 M9 12H15" stroke="currentColor" strokeWidth="2" />
                            )}
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-center">{item.name}</h3>
                        <p className="text-sm text-gray-500 text-center">{item.machine}</p>
                        <div className={`w-full h-1 mt-2 ${item.statusColor}`}></div>
                        <p className="text-xs mt-1 text-center">{item.status}</p>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
    </>
  )
}

export default Parts