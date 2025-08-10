import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, Target, Calendar, BarChart3, TrendingUp, Smartphone, Award, ArrowRight, Camera, FileText, CheckCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
import ProgressRing from './ProgressRing';
import ToggleSwitch from './ToggleSwitch';
import BottomNavBar from './BottomNavBar';
import LineChart from './LineChart';
type Screen = 'welcome' | 'dashboard' | 'home' | 'metrics' | 'upload' | 'daily' | 'goals' | 'catchup';
type ViewMode = 'MTD' | 'EOM';
interface MetricData {
  name: string;
  actual: number;
  target: number;
  category: 'Sales' | 'Attach' | 'Customer' | 'Quality';
  mpid?: string;
}
const PerformanceTrackerApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [viewMode, setViewMode] = useState<ViewMode>('MTD');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [extractedData, setExtractedData] = useState<MetricData[] | null>(null);
  const [showDataSummary, setShowDataSummary] = useState(false);
  const [editingData, setEditingData] = useState<MetricData[] | null>(null);
  const mockMetrics: MetricData[] = [{
    name: 'Total Revenue',
    actual: 45000,
    target: 50000,
    category: 'Sales',
    mpid: "e3979ee5-78c3-4af1-a418-ef3df125203e"
  }, {
    name: 'New Lines',
    actual: 28,
    target: 35,
    category: 'Sales',
    mpid: "5b488640-d705-4c7a-9921-746622d9b7ca"
  }, {
    name: 'Accessories',
    actual: 15,
    target: 20,
    category: 'Attach',
    mpid: "17a679ff-5bde-4499-8de1-68e4189b44eb"
  }, {
    name: 'Insurance',
    actual: 22,
    target: 25,
    category: 'Attach',
    mpid: "fc97f7b8-6854-42af-9bbe-d9634329e1e1"
  }, {
    name: 'NPS Score',
    actual: 8.5,
    target: 9.0,
    category: 'Customer',
    mpid: "a34b4ef8-4567-4168-9c2f-17d08717821c"
  }, {
    name: 'Call Quality',
    actual: 92,
    target: 95,
    category: 'Quality',
    mpid: "8e59972c-45d4-4cbd-a35a-63b149e8a934"
  }];
  const topMetric = mockMetrics.reduce((prev, current) => current.actual / current.target > prev.actual / prev.target ? current : prev);
  const lowestMetric = mockMetrics.reduce((prev, current) => current.actual / current.target < prev.actual / prev.target ? current : prev);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleExtractMetrics = () => {
    setIsExtracting(true);
    setTimeout(() => {
      // Mock extracted data
      const mockExtractedData: MetricData[] = [{
        name: 'Total Revenue',
        actual: 42500,
        target: 50000,
        category: 'Sales',
        mpid: "d160c2d6-ff24-46c7-a32b-3fa61c889a54"
      }, {
        name: 'New Lines',
        actual: 25,
        target: 35,
        category: 'Sales',
        mpid: "e998992c-dd20-4db7-8961-743ee5f2f56b"
      }, {
        name: 'Accessories',
        actual: 18,
        target: 20,
        category: 'Attach',
        mpid: "c1cf0dc7-dd50-49e0-b344-c1563e70df91"
      }, {
        name: 'Insurance',
        actual: 20,
        target: 25,
        category: 'Attach',
        mpid: "71818191-a335-4d53-9f4e-7e54f9dd1cda"
      }];
      setIsExtracting(false);
      setExtractedData(mockExtractedData);
      setEditingData([...mockExtractedData]);
      setShowDataSummary(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };
  const handleDataEdit = (index: number, field: 'actual' | 'target', value: number) => {
    if (editingData) {
      const updated = [...editingData];
      updated[index][field] = value;
      setEditingData(updated);
    }
  };
  const handleSaveData = () => {
    if (editingData) {
      setExtractedData([...editingData]);
      setShowDataSummary(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  const handleCancelEdit = () => {
    setEditingData(extractedData ? [...extractedData] : null);
    setShowDataSummary(false);
  };
  const renderWelcomeScreen = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4" data-magicpath-id="0" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto pt-20" data-magicpath-id="1" data-magicpath-path="PerformanceTrackerApp.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-6" data-magicpath-id="2" data-magicpath-path="PerformanceTrackerApp.tsx">
          <MatteCard className="text-center p-8" variant="accent" data-magicpath-id="3" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E20074] to-[#20074] rounded-2xl flex items-center justify-center shadow-lg" data-magicpath-id="4" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Smartphone className="w-8 h-8 text-white" data-magicpath-id="5" data-magicpath-path="PerformanceTrackerApp.tsx" />
            </div>
            <h1 className="text-2xl font-display text-white mb-2" data-magicpath-id="6" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Tracker</h1>
            <p className="text-gray-400 font-body" data-magicpath-id="7" data-magicpath-path="PerformanceTrackerApp.tsx">Your Metrics. Your Momentum.</p>
          </MatteCard>

          <div className="text-center" data-magicpath-id="8" data-magicpath-path="PerformanceTrackerApp.tsx">
            <p className="text-lg text-gray-300 mb-8 font-body" data-magicpath-id="9" data-magicpath-path="PerformanceTrackerApp.tsx">
              Track your sales metrics, analyze trends, and achieve your goals
            </p>
          </div>

          <MatteCard className="p-6" variant="primary" data-magicpath-id="10" data-magicpath-path="PerformanceTrackerApp.tsx">
            <button onClick={() => setCurrentScreen('dashboard')} className="w-full bg-gradient-to-r from-[#E20074] to-[#20074] text-white py-4 rounded-xl font-heading text-lg flex items-center justify-center space-x-2 hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg" data-magicpath-id="11" data-magicpath-path="PerformanceTrackerApp.tsx">
              <span data-magicpath-id="12" data-magicpath-path="PerformanceTrackerApp.tsx">Get Started</span>
              <ArrowRight className="w-5 h-5" data-magicpath-id="13" data-magicpath-path="PerformanceTrackerApp.tsx" />
            </button>
          </MatteCard>
        </motion.div>
      </div>
    </div>;
  const renderDashboard = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-20" data-magicpath-id="14" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="15" data-magicpath-path="PerformanceTrackerApp.tsx">
        <div className="flex justify-between items-center pt-4 mb-6" data-magicpath-id="16" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h1 className="text-2xl font-display text-white" data-magicpath-id="17" data-magicpath-path="PerformanceTrackerApp.tsx">Dashboard</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" data-magicpath-id="18" data-magicpath-path="PerformanceTrackerApp.tsx" />
        </div>

        <div className="grid grid-cols-2 gap-4" data-magicpath-id="19" data-magicpath-path="PerformanceTrackerApp.tsx">
          <MatteCard className="p-4" variant="accent" data-magicpath-id="20" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="text-center" data-magicpath-id="21" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Award className="w-8 h-8 text-[#22C55E] mx-auto mb-2" data-magicpath-id="22" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <h3 className="text-sm font-caption text-gray-400 mb-1" data-magicpath-id="23" data-magicpath-path="PerformanceTrackerApp.tsx">Top Performing</h3>
              <p className="text-white font-heading" data-magicpath-id="24" data-magicpath-path="PerformanceTrackerApp.tsx">{topMetric.name}</p>
              <p className="text-[#22C55E] text-sm font-caption" data-magicpath-id="25" data-magicpath-path="PerformanceTrackerApp.tsx">
                {Math.round(topMetric.actual / topMetric.target * 100)}%
              </p>
            </div>
          </MatteCard>

          <MatteCard className="p-4" variant="accent" data-magicpath-id="26" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="text-center" data-magicpath-id="27" data-magicpath-path="PerformanceTrackerApp.tsx">
              <TrendingUp className="w-8 h-8 text-[#EF4444] mx-auto mb-2" data-magicpath-id="28" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <h3 className="text-sm font-caption text-gray-400 mb-1" data-magicpath-id="29" data-magicpath-path="PerformanceTrackerApp.tsx">Needs Focus</h3>
              <p className="text-white font-heading" data-magicpath-id="30" data-magicpath-path="PerformanceTrackerApp.tsx">{lowestMetric.name}</p>
              <p className="text-[#EF4444] text-sm font-caption" data-magicpath-id="31" data-magicpath-path="PerformanceTrackerApp.tsx">
                {Math.round(lowestMetric.actual / lowestMetric.target * 100)}%
              </p>
            </div>
          </MatteCard>
        </div>

        <MatteCard className="p-6" variant="primary" data-magicpath-id="32" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h3 className="text-white font-heading mb-4" data-magicpath-id="33" data-magicpath-path="PerformanceTrackerApp.tsx">Monthly Projection</h3>
          <div className="relative" data-magicpath-id="34" data-magicpath-path="PerformanceTrackerApp.tsx">
            <LineChart metrics={mockMetrics} data-magicpath-id="35" data-magicpath-path="PerformanceTrackerApp.tsx" />
          </div>
        </MatteCard>

        <div className="grid grid-cols-2 gap-4" data-magicpath-id="36" data-magicpath-path="PerformanceTrackerApp.tsx">
          <MatteCard className="p-4" variant="secondary" data-magicpath-id="37" data-magicpath-path="PerformanceTrackerApp.tsx">
            <button onClick={() => setCurrentScreen('catchup')} className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white hover:text-[#E20074] transition-colors" data-magicpath-id="38" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Calendar className="w-6 h-6" data-magicpath-id="39" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <span className="text-sm font-caption text-center" data-magicpath-id="40" data-magicpath-path="PerformanceTrackerApp.tsx">
                Catch-Up Plan
              </span>
            </button>
          </MatteCard>

          <MatteCard className="p-4" variant="secondary" data-magicpath-id="41" data-magicpath-path="PerformanceTrackerApp.tsx">
            <button onClick={() => setCurrentScreen('daily')} className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white hover:text-[#E20074] transition-colors" data-magicpath-id="42" data-magicpath-path="PerformanceTrackerApp.tsx">
              <BarChart3 className="w-6 h-6" data-magicpath-id="43" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <span className="text-sm font-caption text-center" data-magicpath-id="44" data-magicpath-path="PerformanceTrackerApp.tsx">
                Shift Tracker
              </span>
            </button>
          </MatteCard>
        </div>

        <MatteCard className="p-6" variant="secondary" data-magicpath-id="45" data-magicpath-path="PerformanceTrackerApp.tsx">
          <div className="text-center" data-magicpath-id="46" data-magicpath-path="PerformanceTrackerApp.tsx">
            <p className="text-gray-400 italic mb-4 font-body" data-magicpath-id="47" data-magicpath-path="PerformanceTrackerApp.tsx">
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </p>
            <button onClick={() => setCurrentScreen('metrics')} className="bg-gradient-to-r from-[#E20074] to-[#20074] text-white px-6 py-2 rounded-lg font-heading hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg" data-magicpath-id="48" data-magicpath-path="PerformanceTrackerApp.tsx">
              View Detailed Reports
            </button>
          </div>
        </MatteCard>
      </div>
    </div>;
  const renderHomeNavigation = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20" data-magicpath-id="49" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto" data-magicpath-id="50" data-magicpath-path="PerformanceTrackerApp.tsx">
        <h1 className="text-2xl font-display text-white text-center pt-4 mb-8" data-magicpath-id="51" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Hub</h1>
        
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="52" data-magicpath-path="PerformanceTrackerApp.tsx">
          {[{
          icon: Upload,
          label: 'Upload Report',
          screen: 'upload' as Screen,
          mpid: "e9b8f2b0-7eda-4935-9ea7-c3607c77311c"
        }, {
          icon: Target,
          label: 'Daily Goals',
          screen: 'goals' as Screen,
          mpid: "98ac5e03-b088-40c4-b9f5-e74949dcbe27"
        }, {
          icon: Calendar,
          label: 'Catch-Up Plan',
          screen: 'catchup' as Screen,
          mpid: "cd115f5e-8a0a-46d5-810e-964443868569"
        }, {
          icon: BarChart3,
          label: 'Shift Tracker',
          screen: 'daily' as Screen,
          mpid: "f183df01-a79a-4fe6-86e5-c46250316973"
        }, {
          icon: TrendingUp,
          label: 'View All Metrics',
          screen: 'metrics' as Screen,
          mpid: "bfa154df-1dc5-410a-bdc6-23a83dc0c308"
        }, {
          icon: Award,
          label: 'Trend Insights',
          screen: 'dashboard' as Screen,
          mpid: "3c8f8bac-0cc7-4538-8408-e844d5a34657"
        }].map((item, index) => {
          const IconComponent = item.icon;
          return <motion.div key={item.label} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="53" data-magicpath-path="PerformanceTrackerApp.tsx">
              <MatteCard className="p-6 h-32" variant="accent" hover data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="PerformanceTrackerApp.tsx">
                <button onClick={() => setCurrentScreen(item.screen)} className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white hover:text-[#E20074] transition-colors" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="55" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <IconComponent className="w-8 h-8" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="56" data-magicpath-path="PerformanceTrackerApp.tsx" />
                  <span className="text-sm font-caption text-center" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="57" data-magicpath-path="PerformanceTrackerApp.tsx">
                    {item.label}
                  </span>
                </button>
              </MatteCard>
            </motion.div>;
        })}
        </div>
      </div>
    </div>;
  const renderMetrics = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20" data-magicpath-id="58" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="59" data-magicpath-path="PerformanceTrackerApp.tsx">
        <div className="flex justify-between items-center pt-4 mb-6" data-magicpath-id="60" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h1 className="text-xl font-display text-white" data-magicpath-id="61" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Metrics</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" data-magicpath-id="62" data-magicpath-path="PerformanceTrackerApp.tsx" />
        </div>

        {['Sales', 'Attach', 'Customer', 'Quality'].map(category => <div key={category} className="space-y-3" data-magicpath-id="63" data-magicpath-path="PerformanceTrackerApp.tsx">
            <h2 className="text-lg font-heading text-white" data-magicpath-id="64" data-magicpath-path="PerformanceTrackerApp.tsx">{category}</h2>
            {mockMetrics.filter(metric => metric.category === category).map(metric => {
          const percentage = Math.round(metric.actual / metric.target * 100);
          const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
          return <MatteCard key={metric.name} className="p-4" variant="primary" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="PerformanceTrackerApp.tsx">
                    <div className="flex items-center justify-between" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="PerformanceTrackerApp.tsx">
                      <div className="flex-1" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="PerformanceTrackerApp.tsx">
                        <h3 className="text-white font-heading" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="68" data-magicpath-path="PerformanceTrackerApp.tsx">
                          {metric.name}
                        </h3>
                        <p className="text-gray-400 text-sm font-body" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-field="actual:unknown,target:unknown" data-magicpath-id="69" data-magicpath-path="PerformanceTrackerApp.tsx">
                          {metric.actual} / {metric.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-caption" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="70" data-magicpath-path="PerformanceTrackerApp.tsx">
                          {status === 'excellent' ? 'Outstanding performance!' : status === 'good' ? 'Good progress, keep it up!' : 'Focus area - you can do this!'}
                        </p>
                      </div>
                      <ProgressRing percentage={percentage} size={60} status={status} data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="PerformanceTrackerApp.tsx" />
                    </div>
                  </MatteCard>;
        })}
          </div>)}
      </div>
    </div>;
  const renderUpload = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20" data-magicpath-id="72" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-6" data-magicpath-id="73" data-magicpath-path="PerformanceTrackerApp.tsx">
        <h1 className="text-2xl font-bold text-white text-center pt-4" data-magicpath-id="74" data-magicpath-path="PerformanceTrackerApp.tsx">Upload Report</h1>
        
        <MatteCard className="p-6" variant="primary" data-magicpath-id="75" data-magicpath-path="PerformanceTrackerApp.tsx">
          <div className="space-y-4" data-magicpath-id="76" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div data-magicpath-id="77" data-magicpath-path="PerformanceTrackerApp.tsx">
              <label htmlFor="sales-rep-name" className="block text-sm font-medium text-gray-300 mb-2" data-magicpath-id="78" data-magicpath-path="PerformanceTrackerApp.tsx">
                Sales Rep Name or ID
              </label>
              <input type="text" id="sales-rep-name" placeholder="Enter your name or employee ID" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent transition-all" data-magicpath-id="79" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <p className="text-xs text-gray-500 mt-1" data-magicpath-id="80" data-magicpath-path="PerformanceTrackerApp.tsx">
                This helps OCR identify your specific data in the report
              </p>
            </div>
            
            <div className="text-center" data-magicpath-id="81" data-magicpath-path="PerformanceTrackerApp.tsx">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" data-magicpath-id="82" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <label htmlFor="image-upload" className="cursor-pointer block p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-[#E20074] hover:bg-gray-800/30 transition-all group" data-magicpath-id="83" data-magicpath-path="PerformanceTrackerApp.tsx">
                <motion.div initial={{
                scale: 1
              }} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex flex-col items-center" data-magicpath-id="84" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <motion.div animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} className="mb-4" data-magicpath-id="85" data-magicpath-path="PerformanceTrackerApp.tsx">
                    <Camera className="w-12 h-12 text-gray-500 group-hover:text-[#E20074] transition-colors duration-300" />
                  </motion.div>
                  <motion.p className="text-gray-400 group-hover:text-white transition-colors duration-300 font-medium" animate={{
                  opacity: [0.7, 1, 0.7]
                }} transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} data-magicpath-id="86" data-magicpath-path="PerformanceTrackerApp.tsx">
                    Tap to upload report image
                  </motion.p>
                  <motion.div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E20074] to-transparent opacity-0 group-hover:opacity-100" initial={{
                  scaleX: 0
                }} whileHover={{
                  scaleX: 1
                }} transition={{
                  duration: 0.3
                }} data-magicpath-id="87" data-magicpath-path="PerformanceTrackerApp.tsx" />
                </motion.div>
              </label>
            </div>
          </div>
        </MatteCard>

        {uploadedImage && <MatteCard className="p-4" variant="secondary" data-magicpath-id="88" data-magicpath-path="PerformanceTrackerApp.tsx">
            <img src={uploadedImage} alt="Uploaded report" className="w-full h-48 object-cover rounded-lg mb-4" data-magicpath-id="89" data-magicpath-path="PerformanceTrackerApp.tsx" />
            <button onClick={handleExtractMetrics} disabled={isExtracting} className="w-full bg-gradient-to-r from-[#E20074] to-[#20074] text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg" data-magicpath-id="90" data-magicpath-path="PerformanceTrackerApp.tsx">
              {isExtracting ? 'Extracting...' : 'Auto Extract Metrics'}
            </button>
          </MatteCard>}

        {/* Data Summary Modal */}
        {showDataSummary && extractedData && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-magicpath-id="91" data-magicpath-path="PerformanceTrackerApp.tsx">
            <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="w-full max-w-md max-h-[80vh] overflow-y-auto" data-magicpath-id="92" data-magicpath-path="PerformanceTrackerApp.tsx">
              <MatteCard className="p-6" variant="primary" data-magicpath-id="93" data-magicpath-path="PerformanceTrackerApp.tsx">
                <div className="flex items-center justify-between mb-6" data-magicpath-id="94" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <h2 className="text-xl font-bold text-white" data-magicpath-id="95" data-magicpath-path="PerformanceTrackerApp.tsx">Extracted Data Summary</h2>
                  <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white transition-colors" data-magicpath-id="96" data-magicpath-path="PerformanceTrackerApp.tsx">
                    <X className="w-5 h-5" data-magicpath-id="97" data-magicpath-path="PerformanceTrackerApp.tsx" />
                  </button>
                </div>

                <div className="space-y-4 mb-6" data-magicpath-id="98" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <p className="text-gray-300 text-sm" data-magicpath-id="99" data-magicpath-path="PerformanceTrackerApp.tsx">
                    Review and edit the extracted metrics below. Make any necessary corrections before saving.
                  </p>
                  
                  {editingData?.map((metric, index) => <MatteCard key={index} className="p-4" variant="secondary" data-magicpath-id="100" data-magicpath-path="PerformanceTrackerApp.tsx">
                      <div className="space-y-3" data-magicpath-id="101" data-magicpath-path="PerformanceTrackerApp.tsx">
                        <h3 className="text-white font-medium" data-magicpath-id="102" data-magicpath-path="PerformanceTrackerApp.tsx">{metric.name}</h3>
                        <div className="grid grid-cols-2 gap-3" data-magicpath-id="103" data-magicpath-path="PerformanceTrackerApp.tsx">
                          <div data-magicpath-id="104" data-magicpath-path="PerformanceTrackerApp.tsx">
                            <label className="block text-xs text-gray-400 mb-1" data-magicpath-id="105" data-magicpath-path="PerformanceTrackerApp.tsx">Actual</label>
                            <input type="number" value={metric.actual} onChange={e => handleDataEdit(index, 'actual', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" data-magicpath-id="106" data-magicpath-path="PerformanceTrackerApp.tsx" />
                          </div>
                          <div data-magicpath-id="107" data-magicpath-path="PerformanceTrackerApp.tsx">
                            <label className="block text-xs text-gray-400 mb-1" data-magicpath-id="108" data-magicpath-path="PerformanceTrackerApp.tsx">Target</label>
                            <input type="number" value={metric.target} onChange={e => handleDataEdit(index, 'target', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" data-magicpath-id="109" data-magicpath-path="PerformanceTrackerApp.tsx" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs" data-magicpath-id="110" data-magicpath-path="PerformanceTrackerApp.tsx">
                          <span className="text-gray-500" data-magicpath-id="111" data-magicpath-path="PerformanceTrackerApp.tsx">Category: {metric.category}</span>
                          <span className={`font-medium ${metric.actual / metric.target >= 0.9 ? 'text-green-400' : metric.actual / metric.target >= 0.7 ? 'text-yellow-400' : 'text-red-400'}`} data-magicpath-id="112" data-magicpath-path="PerformanceTrackerApp.tsx">
                            {Math.round(metric.actual / metric.target * 100)}%
                          </span>
                        </div>
                      </div>
                    </MatteCard>)}
                </div>

                <div className="flex space-x-3" data-magicpath-id="113" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <button onClick={handleCancelEdit} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors" data-magicpath-id="114" data-magicpath-path="PerformanceTrackerApp.tsx">
                    Cancel
                  </button>
                  <button onClick={handleSaveData} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#E20074] to-[#20074] text-white rounded-lg font-medium hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg" data-magicpath-id="115" data-magicpath-path="PerformanceTrackerApp.tsx">
                    Save Data
                  </button>
                </div>
              </MatteCard>
            </motion.div>
          </div>}

        {isExtracting && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" data-magicpath-id="116" data-magicpath-path="PerformanceTrackerApp.tsx">
            <MatteCard className="p-8 text-center" variant="accent" data-magicpath-id="117" data-magicpath-path="PerformanceTrackerApp.tsx">
              <div className="animate-spin w-8 h-8 border-2 border-[#E20074] border-t-transparent rounded-full mx-auto mb-4" data-magicpath-id="118" data-magicpath-path="PerformanceTrackerApp.tsx"></div>
              <p className="text-white" data-magicpath-id="119" data-magicpath-path="PerformanceTrackerApp.tsx">Processing image...</p>
            </MatteCard>
          </div>}
      </div>
    </div>;
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'dashboard':
        return renderDashboard();
      case 'metrics':
        return renderMetrics();
      case 'upload':
        return renderUpload();
      default:
        return renderDashboard();
    }
  };
  return <div className="relative" data-magicpath-id="120" data-magicpath-path="PerformanceTrackerApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="121" data-magicpath-path="PerformanceTrackerApp.tsx">
        <motion.div key={currentScreen} initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: -20
      }} transition={{
        duration: 0.3
      }} data-magicpath-id="122" data-magicpath-path="PerformanceTrackerApp.tsx">
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>

      {currentScreen !== 'welcome' && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} data-magicpath-id="123" data-magicpath-path="PerformanceTrackerApp.tsx" />}

      {showToast && <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 50
    }} className="fixed bottom-24 left-4 right-4 z-50" data-magicpath-id="124" data-magicpath-path="PerformanceTrackerApp.tsx">
          <MatteCard className="p-4" variant="accent" data-magicpath-id="125" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="flex items-center space-x-3" data-magicpath-id="126" data-magicpath-path="PerformanceTrackerApp.tsx">
              <CheckCircle className="w-5 h-5 text-green-400" data-magicpath-id="127" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <p className="text-white" data-magicpath-id="128" data-magicpath-path="PerformanceTrackerApp.tsx">
                {extractedData ? 'Data saved successfully!' : 'Metrics extracted successfully!'}
              </p>
            </div>
          </MatteCard>
        </motion.div>}
    </div>;
};
export default PerformanceTrackerApp;