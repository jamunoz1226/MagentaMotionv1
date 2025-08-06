import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, Target, Calendar, BarChart3, TrendingUp, Smartphone, Award, ArrowRight, Camera, FileText, CheckCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import ProgressRing from './ProgressRing';
import ToggleSwitch from './ToggleSwitch';
import BottomNavBar from './BottomNavBar';
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
  const mockMetrics: MetricData[] = [{
    name: 'Total Revenue',
    actual: 45000,
    target: 50000,
    category: 'Sales',
    mpid: "dcd4e1e4-47a5-4ce9-bbee-f1fe2889c4a5"
  }, {
    name: 'New Lines',
    actual: 28,
    target: 35,
    category: 'Sales',
    mpid: "06f1a1c8-f092-45c3-8b2c-405c77b3482b"
  }, {
    name: 'Accessories',
    actual: 15,
    target: 20,
    category: 'Attach',
    mpid: "51099a14-5e39-42d6-93b5-2d2653c2855d"
  }, {
    name: 'Insurance',
    actual: 22,
    target: 25,
    category: 'Attach',
    mpid: "bfc66e69-ef92-4853-9fc7-82c1c64c28c0"
  }, {
    name: 'NPS Score',
    actual: 8.5,
    target: 9.0,
    category: 'Customer',
    mpid: "3254f505-e1ff-46bc-937f-31b00fb61b33"
  }, {
    name: 'Call Quality',
    actual: 92,
    target: 95,
    category: 'Quality',
    mpid: "7a23b3d8-4944-4013-b213-99b4a993b3f5"
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
      setIsExtracting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };
  const renderWelcomeScreen = () => <div className="min-h-screen bg-black p-4" data-magicpath-id="0" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto pt-20" data-magicpath-id="1" data-magicpath-path="PerformanceTrackerApp.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-6" data-magicpath-id="2" data-magicpath-path="PerformanceTrackerApp.tsx">
          <GlassCard className="text-center p-8" data-magicpath-id="3" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#E20074] rounded-full flex items-center justify-center" data-magicpath-id="4" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Smartphone className="w-8 h-8 text-white" data-magicpath-id="5" data-magicpath-path="PerformanceTrackerApp.tsx" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" data-magicpath-id="6" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Tracker</h1>
            <p className="text-gray-400" data-magicpath-id="7" data-magicpath-path="PerformanceTrackerApp.tsx">Your Metrics. Your Momentum.</p>
          </GlassCard>

          <div className="text-center" data-magicpath-id="8" data-magicpath-path="PerformanceTrackerApp.tsx">
            <p className="text-lg text-gray-300 mb-8" data-magicpath-id="9" data-magicpath-path="PerformanceTrackerApp.tsx">
              Track your sales metrics, analyze trends, and achieve your goals
            </p>
          </div>

          <GlassCard className="p-6" data-magicpath-id="10" data-magicpath-path="PerformanceTrackerApp.tsx">
            <button onClick={() => setCurrentScreen('dashboard')} className="w-full bg-[#E20074] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-[#E20074]/90 transition-all shadow-lg shadow-[#E20074]/25" data-magicpath-id="11" data-magicpath-path="PerformanceTrackerApp.tsx">
              <span data-magicpath-id="12" data-magicpath-path="PerformanceTrackerApp.tsx">Get Started</span>
              <ArrowRight className="w-5 h-5" data-magicpath-id="13" data-magicpath-path="PerformanceTrackerApp.tsx" />
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>;
  const renderDashboard = () => <div className="min-h-screen bg-black p-4 pb-20" data-magicpath-id="14" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="15" data-magicpath-path="PerformanceTrackerApp.tsx">
        <div className="flex justify-between items-center pt-4 mb-6" data-magicpath-id="16" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h1 className="text-2xl font-bold text-white" data-magicpath-id="17" data-magicpath-path="PerformanceTrackerApp.tsx">Dashboard</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" data-magicpath-id="18" data-magicpath-path="PerformanceTrackerApp.tsx" />
        </div>

        <div className="grid grid-cols-2 gap-4" data-magicpath-id="19" data-magicpath-path="PerformanceTrackerApp.tsx">
          <GlassCard className="p-4" data-magicpath-id="20" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="text-center" data-magicpath-id="21" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Award className="w-8 h-8 text-[#22C55E] mx-auto mb-2" data-magicpath-id="22" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <h3 className="text-sm font-medium text-gray-400 mb-1" data-magicpath-id="23" data-magicpath-path="PerformanceTrackerApp.tsx">Top Performing</h3>
              <p className="text-white font-semibold" data-magicpath-id="24" data-magicpath-path="PerformanceTrackerApp.tsx">{topMetric.name}</p>
              <p className="text-[#22C55E] text-sm" data-magicpath-id="25" data-magicpath-path="PerformanceTrackerApp.tsx">
                {Math.round(topMetric.actual / topMetric.target * 100)}%
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-4" data-magicpath-id="26" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="text-center" data-magicpath-id="27" data-magicpath-path="PerformanceTrackerApp.tsx">
              <TrendingUp className="w-8 h-8 text-[#EF4444] mx-auto mb-2" data-magicpath-id="28" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <h3 className="text-sm font-medium text-gray-400 mb-1" data-magicpath-id="29" data-magicpath-path="PerformanceTrackerApp.tsx">Needs Focus</h3>
              <p className="text-white font-semibold" data-magicpath-id="30" data-magicpath-path="PerformanceTrackerApp.tsx">{lowestMetric.name}</p>
              <p className="text-[#EF4444] text-sm" data-magicpath-id="31" data-magicpath-path="PerformanceTrackerApp.tsx">
                {Math.round(lowestMetric.actual / lowestMetric.target * 100)}%
              </p>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6" data-magicpath-id="32" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h3 className="text-white font-semibold mb-4" data-magicpath-id="33" data-magicpath-path="PerformanceTrackerApp.tsx">Monthly Projection</h3>
          <div className="h-32 bg-gradient-to-r from-[#E20074]/20 to-gray-600/20 rounded-lg flex items-center justify-center border border-gray-700" data-magicpath-id="34" data-magicpath-path="PerformanceTrackerApp.tsx">
            <p className="text-gray-400" data-magicpath-id="35" data-magicpath-path="PerformanceTrackerApp.tsx">Trend Chart Placeholder</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" data-magicpath-id="36" data-magicpath-path="PerformanceTrackerApp.tsx">
          <div className="text-center" data-magicpath-id="37" data-magicpath-path="PerformanceTrackerApp.tsx">
            <p className="text-gray-400 italic mb-4" data-magicpath-id="38" data-magicpath-path="PerformanceTrackerApp.tsx">
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </p>
            <button onClick={() => setCurrentScreen('metrics')} className="bg-[#E20074] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#E20074]/90 transition-all shadow-lg shadow-[#E20074]/25" data-magicpath-id="39" data-magicpath-path="PerformanceTrackerApp.tsx">
              View Detailed Reports
            </button>
          </div>
        </GlassCard>
      </div>
    </div>;
  const renderHomeNavigation = () => <div className="min-h-screen bg-black p-4 pb-20" data-magicpath-id="40" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto" data-magicpath-id="41" data-magicpath-path="PerformanceTrackerApp.tsx">
        <h1 className="text-2xl font-bold text-white text-center pt-4 mb-8" data-magicpath-id="42" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Hub</h1>
        
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="43" data-magicpath-path="PerformanceTrackerApp.tsx">
          {[{
          icon: Upload,
          label: 'Upload Report',
          screen: 'upload' as Screen,
          mpid: "ca7a98ee-0a98-40e5-852a-b8c4272e34b2"
        }, {
          icon: Target,
          label: 'Daily Goals',
          screen: 'goals' as Screen,
          mpid: "c9928401-3266-4204-add4-f665077d75a5"
        }, {
          icon: Calendar,
          label: 'Catch-Up Plan',
          screen: 'catchup' as Screen,
          mpid: "4ec3d9ef-18a9-4711-9630-50aeaa1cfdb8"
        }, {
          icon: BarChart3,
          label: 'Shift Tracker',
          screen: 'daily' as Screen,
          mpid: "51e1637f-99ac-4708-92b5-fb580d9406b8"
        }, {
          icon: TrendingUp,
          label: 'View All Metrics',
          screen: 'metrics' as Screen,
          mpid: "42550bba-4f76-4d3e-a77c-4ceb5046208f"
        }, {
          icon: Award,
          label: 'Trend Insights',
          screen: 'dashboard' as Screen,
          mpid: "63a386aa-d0b9-4ffb-bb23-dba2f7760f9f"
        }].map((item, index) => <motion.div key={item.label} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="44" data-magicpath-path="PerformanceTrackerApp.tsx">
              <GlassCard className="p-6 h-32" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="45" data-magicpath-path="PerformanceTrackerApp.tsx">
                <button onClick={() => setCurrentScreen(item.screen)} className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white hover:text-[#E20074] transition-colors" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="46" data-magicpath-path="PerformanceTrackerApp.tsx">
                  <item.icon className="w-8 h-8" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="PerformanceTrackerApp.tsx" />
                  <span className="text-sm font-medium text-center" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="48" data-magicpath-path="PerformanceTrackerApp.tsx">{item.label}</span>
                </button>
              </GlassCard>
            </motion.div>)}
        </div>
      </div>
    </div>;
  const renderMetrics = () => <div className="min-h-screen bg-black p-4 pb-20" data-magicpath-id="49" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="50" data-magicpath-path="PerformanceTrackerApp.tsx">
        <div className="flex justify-between items-center pt-4 mb-6" data-magicpath-id="51" data-magicpath-path="PerformanceTrackerApp.tsx">
          <h1 className="text-xl font-bold text-white" data-magicpath-id="52" data-magicpath-path="PerformanceTrackerApp.tsx">Performance Metrics</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" data-magicpath-id="53" data-magicpath-path="PerformanceTrackerApp.tsx" />
        </div>

        {['Sales', 'Attach', 'Customer', 'Quality'].map(category => <div key={category} className="space-y-3" data-magicpath-id="54" data-magicpath-path="PerformanceTrackerApp.tsx">
            <h2 className="text-lg font-semibold text-white" data-magicpath-id="55" data-magicpath-path="PerformanceTrackerApp.tsx">{category}</h2>
            {mockMetrics.filter(metric => metric.category === category).map(metric => {
          const percentage = Math.round(metric.actual / metric.target * 100);
          const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
          return <GlassCard key={metric.name} className="p-4" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="56" data-magicpath-path="PerformanceTrackerApp.tsx">
                    <div className="flex items-center justify-between" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="57" data-magicpath-path="PerformanceTrackerApp.tsx">
                      <div className="flex-1" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="58" data-magicpath-path="PerformanceTrackerApp.tsx">
                        <h3 className="text-white font-medium" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="59" data-magicpath-path="PerformanceTrackerApp.tsx">{metric.name}</h3>
                        <p className="text-gray-400 text-sm" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-field="actual:unknown,target:unknown" data-magicpath-id="60" data-magicpath-path="PerformanceTrackerApp.tsx">
                          {metric.actual} / {metric.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1" data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="PerformanceTrackerApp.tsx">
                          {status === 'excellent' ? 'Outstanding performance!' : status === 'good' ? 'Good progress, keep it up!' : 'Focus area - you can do this!'}
                        </p>
                      </div>
                      <ProgressRing percentage={percentage} size={60} status={status} data-magicpath-uuid={(metric as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="PerformanceTrackerApp.tsx" />
                    </div>
                  </GlassCard>;
        })}
          </div>)}
      </div>
    </div>;
  const renderUpload = () => <div className="min-h-screen bg-black p-4 pb-20" data-magicpath-id="63" data-magicpath-path="PerformanceTrackerApp.tsx">
      <div className="max-w-md mx-auto space-y-6" data-magicpath-id="64" data-magicpath-path="PerformanceTrackerApp.tsx">
        <h1 className="text-2xl font-bold text-white text-center pt-4" data-magicpath-id="65" data-magicpath-path="PerformanceTrackerApp.tsx">Upload Report</h1>
        
        <GlassCard className="p-6" data-magicpath-id="66" data-magicpath-path="PerformanceTrackerApp.tsx">
          <div className="text-center" data-magicpath-id="67" data-magicpath-path="PerformanceTrackerApp.tsx">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" data-magicpath-id="68" data-magicpath-path="PerformanceTrackerApp.tsx" />
            <label htmlFor="image-upload" className="cursor-pointer block p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-[#E20074] transition-colors" data-magicpath-id="69" data-magicpath-path="PerformanceTrackerApp.tsx">
              <Camera className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400" data-magicpath-id="70" data-magicpath-path="PerformanceTrackerApp.tsx">Tap to upload report image</p>
            </label>
          </div>
        </GlassCard>

        {uploadedImage && <GlassCard className="p-4" data-magicpath-id="71" data-magicpath-path="PerformanceTrackerApp.tsx">
            <img src={uploadedImage} alt="Uploaded report" className="w-full h-48 object-cover rounded-lg mb-4" data-magicpath-id="72" data-magicpath-path="PerformanceTrackerApp.tsx" />
            <button onClick={handleExtractMetrics} disabled={isExtracting} className="w-full bg-[#E20074] text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-[#E20074]/90 transition-all shadow-lg shadow-[#E20074]/25" data-magicpath-id="73" data-magicpath-path="PerformanceTrackerApp.tsx">
              {isExtracting ? 'Extracting...' : 'Auto Extract Metrics'}
            </button>
          </GlassCard>}

        {isExtracting && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" data-magicpath-id="74" data-magicpath-path="PerformanceTrackerApp.tsx">
            <GlassCard className="p-8 text-center" data-magicpath-id="75" data-magicpath-path="PerformanceTrackerApp.tsx">
              <div className="animate-spin w-8 h-8 border-2 border-[#E20074] border-t-transparent rounded-full mx-auto mb-4" data-magicpath-id="76" data-magicpath-path="PerformanceTrackerApp.tsx"></div>
              <p className="text-white" data-magicpath-id="77" data-magicpath-path="PerformanceTrackerApp.tsx">Processing image...</p>
            </GlassCard>
          </div>}
      </div>
    </div>;
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'dashboard':
        return renderDashboard();
      case 'home':
        return renderHomeNavigation();
      case 'metrics':
        return renderMetrics();
      case 'upload':
        return renderUpload();
      default:
        return renderHomeNavigation();
    }
  };
  return <div className="relative" data-magicpath-id="78" data-magicpath-path="PerformanceTrackerApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="79" data-magicpath-path="PerformanceTrackerApp.tsx">
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
      }} data-magicpath-id="80" data-magicpath-path="PerformanceTrackerApp.tsx">
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>

      {currentScreen !== 'welcome' && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} data-magicpath-id="81" data-magicpath-path="PerformanceTrackerApp.tsx" />}

      {showToast && <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 50
    }} className="fixed bottom-24 left-4 right-4 z-50" data-magicpath-id="82" data-magicpath-path="PerformanceTrackerApp.tsx">
          <GlassCard className="p-4" data-magicpath-id="83" data-magicpath-path="PerformanceTrackerApp.tsx">
            <div className="flex items-center space-x-3" data-magicpath-id="84" data-magicpath-path="PerformanceTrackerApp.tsx">
              <CheckCircle className="w-5 h-5 text-green-400" data-magicpath-id="85" data-magicpath-path="PerformanceTrackerApp.tsx" />
              <p className="text-white" data-magicpath-id="86" data-magicpath-path="PerformanceTrackerApp.tsx">Metrics extracted successfully!</p>
            </div>
          </GlassCard>
        </motion.div>}
    </div>;
};
export default PerformanceTrackerApp;