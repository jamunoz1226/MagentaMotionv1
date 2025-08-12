import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, Target, Calendar, BarChart3, TrendingUp, Smartphone, Award, ArrowRight, Camera, FileText, CheckCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
import ProgressRing from './ProgressRing';
import ToggleSwitch from './ToggleSwitch';
import BottomNavBar from './BottomNavBar';
import LineChart from './LineChart';
import CatchUpView from './CatchUpView';
import ShiftView from './ShiftView';
import { useCatchUpStore } from './CatchUpStore';
type Screen = 'welcome' | 'dashboard' | 'home' | 'metrics' | 'upload' | 'daily' | 'goals' | 'catchup' | 'shift';
type ViewMode = 'MTD' | 'EOM';
interface MetricData {
  name: string;
  actual: number;
  target: number;
  category: 'Sales' | 'Attach' | 'Customer' | 'Quality';
}
interface CallQualityDetails {
  score: number;
  target: number;
  breakdown: {
    greeting: number;
    productKnowledge: number;
    objectionHandling: number;
    closing: number;
  };
  recentCalls: {
    date: string;
    score: number;
    duration: string;
    customer: string;
  }[];
  tips: string[];
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
  const [showCallQualityDetails, setShowCallQualityDetails] = useState(false);
  const [selectedMetricForActions, setSelectedMetricForActions] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Catch-up store
  const catchUpStore = useCatchUpStore();

  // Mock call quality details data
  const callQualityDetails: CallQualityDetails = {
    score: 92,
    target: 95,
    breakdown: {
      greeting: 95,
      productKnowledge: 88,
      objectionHandling: 90,
      closing: 94
    },
    recentCalls: [{
      date: '2024-01-15',
      score: 94,
      duration: '12:30',
      customer: 'John D.'
    }, {
      date: '2024-01-14',
      score: 89,
      duration: '8:45',
      customer: 'Sarah M.'
    }, {
      date: '2024-01-13',
      score: 96,
      duration: '15:20',
      customer: 'Mike R.'
    }, {
      date: '2024-01-12',
      score: 87,
      duration: '6:15',
      customer: 'Lisa K.'
    }],
    tips: ['Focus on product knowledge - consider reviewing latest features', 'Great closing technique! Keep up the excellent work', 'Greeting scores are excellent - maintain this standard']
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showCallQualityDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCallQualityDetails]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCallQualityDetails) {
        setShowCallQualityDetails(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCallQualityDetails]);
  const mockMetrics: MetricData[] = [{
    name: 'Total Revenue',
    actual: 45000,
    target: 50000,
    category: 'Sales'
  }, {
    name: 'New Lines',
    actual: 28,
    target: 35,
    category: 'Sales'
  }, {
    name: 'Accessories',
    actual: 15,
    target: 20,
    category: 'Attach'
  }, {
    name: 'Insurance',
    actual: 22,
    target: 25,
    category: 'Attach'
  }, {
    name: 'NPS Score',
    actual: 8.5,
    target: 9.0,
    category: 'Customer'
  }, {
    name: 'Call Quality',
    actual: 92,
    target: 95,
    category: 'Quality'
  }];
  const topMetric = mockMetrics.reduce((prev, current) => current.actual / current.target > prev.actual / prev.target ? current : prev);
  const lowestMetric = mockMetrics.reduce((prev, current) => current.actual / current.target < prev.actual / prev.target ? current : prev);

  // Sort metrics by performance percentage
  const sortedMetrics = [...mockMetrics].sort((a, b) => b.actual / b.target - a.actual / a.target);
  const topTwoMetrics = sortedMetrics.slice(0, 2);
  const bottomTwoMetrics = sortedMetrics.slice(-2);

  // Get icons for metrics
  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'Total Revenue':
        return TrendingUp;
      case 'New Lines':
        return Target;
      case 'Accessories':
        return Award;
      case 'Insurance':
        return CheckCircle;
      case 'NPS Score':
        return Home;
      case 'Call Quality':
        return BarChart3;
      default:
        return Award;
    }
  };
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
        category: 'Sales'
      }, {
        name: 'New Lines',
        actual: 25,
        target: 35,
        category: 'Sales'
      }, {
        name: 'Accessories',
        actual: 18,
        target: 20,
        category: 'Attach'
      }, {
        name: 'Insurance',
        actual: 20,
        target: 25,
        category: 'Attach'
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
  const renderWelcomeScreen = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4">
      <div className="max-w-md mx-auto pt-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-6">
          <MatteCard className="text-center p-8" variant="accent">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E20074] to-[#20074] rounded-2xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display text-white mb-2">Performance Tracker</h1>
            <p className="text-gray-400 font-body">Your Metrics. Your Momentum.</p>
          </MatteCard>

          <div className="text-center">
            <p className="text-lg text-gray-300 mb-8 font-body">
              Track your sales metrics, analyze trends, and achieve your goals
            </p>
          </div>

          <MatteCard className="p-6" variant="primary">
            <button onClick={() => setCurrentScreen('dashboard')} className="w-full bg-gradient-to-r from-[#E20074] to-[#20074] text-white py-4 rounded-xl font-heading text-lg flex items-center justify-center space-x-2 hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </MatteCard>
        </motion.div>
      </div>
    </div>;
  const renderDashboard = () => <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pt-4 mb-6">
          <h1 className="text-2xl font-display text-white">Dashboard</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" />
        </div>

        {/* Top Performing and Needs Focus Cards */}
        <div className="dash-kpi-grid">
          {/* Top Performing Card */}
          <MatteCard className="dash-kpi p-4" variant="accent">
            <h2 className="text-lg font-heading text-white mb-3">Top Performing</h2>
            <div className="space-y-3">
              {topTwoMetrics.map((metric, index) => {
              const percentage = Math.round(metric.actual / metric.target * 100);
              const IconComponent = getMetricIcon(metric.name);
              return <div key={metric.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{metric.name}</h3>
                        <p className="text-gray-400 text-xs font-body">
                          {metric.actual} / {metric.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{percentage}%</div>
                      <div className="text-xs text-gray-400">to target</div>
                    </div>
                  </div>;
            })}
            </div>
          </MatteCard>

          {/* Needs Focus Card */}
          <MatteCard className="dash-kpi p-4" variant="secondary">
            <h2 className="text-lg font-heading text-white mb-3">Needs Focus</h2>
            <div className="space-y-3">
              {bottomTwoMetrics.map((metric, index) => {
              const percentage = Math.round(metric.actual / metric.target * 100);
              const IconComponent = getMetricIcon(metric.name);
              return <div key={metric.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{metric.name}</h3>
                        <p className="text-gray-400 text-xs font-body">
                          {metric.actual} / {metric.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-400">{percentage}%</div>
                      <div className="text-xs text-gray-400">needs focus</div>
                    </div>
                  </div>;
            })}
            </div>
          </MatteCard>
        </div>

        {/* Performance Chart */}
        <MatteCard className="p-6" variant="primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-heading text-lg">Performance Trend</h3>
            <div className="text-xs text-gray-400">{viewMode} View</div>
          </div>
          <LineChart metrics={mockMetrics} />
        </MatteCard>

        {/* Motivational Quote */}
        <MatteCard className="p-6" variant="accent">
          <div className="text-center">
            <h3 className="text-white font-heading text-lg mb-2">Daily Motivation</h3>
            <blockquote className="text-gray-300 font-body italic text-sm leading-relaxed">
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </blockquote>
            <p className="text-gray-500 text-xs mt-2">— Winston Churchill</p>
          </div>
        </MatteCard>
      </div>
    </div>;
  const renderHomeNavigation = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-display text-white text-center pt-4 mb-8">Performance Hub</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {[{
          icon: Upload,
          label: 'Upload Report',
          screen: 'upload' as Screen
        }, {
          icon: Target,
          label: 'Daily Goals',
          screen: 'goals' as Screen
        }, {
          icon: Calendar,
          label: 'Catch-Up Plan',
          screen: 'catchup' as Screen
        }, {
          icon: BarChart3,
          label: 'Shift Tracker',
          screen: 'daily' as Screen
        }, {
          icon: TrendingUp,
          label: 'View All Metrics',
          screen: 'metrics' as Screen
        }, {
          icon: Award,
          label: 'Trend Insights',
          screen: 'dashboard' as Screen
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
          }}>
              <MatteCard className="p-6 h-32" variant="accent" hover>
                <button onClick={() => setCurrentScreen(item.screen)} className="w-full h-full flex flex-col items-center justify-center space-y-2 text-white hover:text-[#E20074] transition-colors">
                  <IconComponent className="w-8 h-8" />
                  <span className="text-sm font-caption text-center">
                    {item.label}
                  </span>
                </button>
              </MatteCard>
            </motion.div>;
        })}
        </div>
      </div>
    </div>;
  const renderMetrics = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-between items-center pt-4 mb-6">
          <h1 className="text-xl font-display text-white">Performance Metrics</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => setViewMode(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" />
        </div>

        {['Sales', 'Attach', 'Customer', 'Quality'].map(category => <div key={category} className="space-y-3">
            <h2 className="text-lg font-heading text-white">{category}</h2>
            {mockMetrics.filter(metric => metric.category === category).map(metric => {
          const percentage = Math.round(metric.actual / metric.target * 100);
          const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
          const isCallQuality = metric.name === 'Call Quality';
          return <MatteCard key={metric.name} className={`p-4 ${isCallQuality ? 'cursor-pointer hover:bg-gray-800/30 transition-colors' : ''}`} variant="primary" onClick={isCallQuality ? () => setShowCallQualityDetails(true) : undefined}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-heading">
                          {metric.name}
                        </h3>
                        <p className="text-gray-400 text-sm font-body">
                          {metric.actual} / {metric.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-caption">
                          {status === 'excellent' ? 'Outstanding performance!' : status === 'good' ? 'Good progress, keep it up!' : 'Focus area - you can do this!'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ProgressRing percentage={percentage} size={60} status={status} />
                        {isCallQuality && <ArrowRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </MatteCard>;
        })}
          </div>)}
      </div>

      {/* Call Quality Details Modal */}
      <AnimatePresence>
        {showCallQualityDetails && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => {
        if (e.target === e.currentTarget) {
          setShowCallQualityDetails(false);
        }
      }}>
            <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} transition={{
          type: "spring",
          damping: 25,
          stiffness: 300
        }} className="w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <MatteCard className="p-6" variant="primary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Call Quality Details</h2>
                  <button onClick={() => setShowCallQualityDetails(false)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Overall Score */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <ProgressRing percentage={Math.round(callQualityDetails.score / callQualityDetails.target * 100)} size={80} status={callQualityDetails.score >= 90 ? 'excellent' : 'good'} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{callQualityDetails.score}/100</h3>
                  <p className="text-gray-400 text-sm">Target: {callQualityDetails.target}</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-white">Performance Breakdown</h4>
                  {Object.entries(callQualityDetails.breakdown).map(([key, value]) => <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${value >= 90 ? 'bg-green-400' : value >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{
                      width: `${value}%`
                    }} />
                        </div>
                        <span className="text-white text-sm font-medium w-8">{value}%</span>
                      </div>
                    </div>)}
                </div>

                {/* Recent Calls */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-white">Recent Calls</h4>
                  <div className="space-y-2">
                    {callQualityDetails.recentCalls.map((call, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-medium">{call.customer}</p>
                          <p className="text-gray-400 text-xs">{call.date} • {call.duration}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${call.score >= 90 ? 'bg-green-400/20 text-green-400' : call.score >= 80 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'}`}>
                          {call.score}%
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Improvement Tips</h4>
                  <div className="space-y-2">
                    {callQualityDetails.tips.map((tip, index) => <div key={index} className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{tip}</p>
                      </div>)}
                  </div>
                </div>
              </MatteCard>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
  const renderUpload = () => <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white text-center pt-4">Upload Report</h1>
        
        <MatteCard className="p-6" variant="primary">
          <div className="space-y-4">
            <div>
              <label htmlFor="sales-rep-name" className="block text-sm font-medium text-gray-300 mb-2">
                Sales Rep Name or ID
              </label>
              <input type="text" id="sales-rep-name" placeholder="Enter your name or employee ID" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent transition-all" />
              <p className="text-xs text-gray-500 mt-1">
                This helps OCR identify your specific data in the report
              </p>
            </div>
            
            <div className="text-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer block p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-[#E20074] hover:bg-gray-800/30 transition-all group">
                <motion.div initial={{
                scale: 1
              }} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="flex flex-col items-center">
                  <motion.div animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} className="mb-4">
                    <Camera className="w-12 h-12 text-gray-500 group-hover:text-[#E20074] transition-colors duration-300" />
                  </motion.div>
                  <motion.p className="text-gray-400 group-hover:text-white transition-colors duration-300 font-medium" animate={{
                  opacity: [0.7, 1, 0.7]
                }} transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}>
                    Tap to upload report image
                  </motion.p>
                  <motion.div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E20074] to-transparent opacity-0 group-hover:opacity-100" initial={{
                  scaleX: 0
                }} whileHover={{
                  scaleX: 1
                }} transition={{
                  duration: 0.3
                }} />
                </motion.div>
              </label>
            </div>
          </div>
        </MatteCard>

        {uploadedImage && <MatteCard className="p-4" variant="secondary">
            <img src={uploadedImage} alt="Uploaded report" className="w-full h-48 object-cover rounded-lg mb-4" />
            <button onClick={handleExtractMetrics} disabled={isExtracting} className="w-full bg-gradient-to-r from-[#E20074] to-[#20074] text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg">
              {isExtracting ? 'Extracting...' : 'Auto Extract Metrics'}
            </button>
          </MatteCard>}

        {/* Data Summary Modal */}
        {showDataSummary && extractedData && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="w-full max-w-md max-h-[80vh] overflow-y-auto">
              <MatteCard className="p-6" variant="primary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Extracted Data Summary</h2>
                  <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-300 text-sm">
                    Review and edit the extracted metrics below. Make any necessary corrections before saving.
                  </p>
                  
                  {editingData?.map((metric, index) => <MatteCard key={index} className="p-4" variant="secondary">
                      <div className="space-y-3">
                        <h3 className="text-white font-medium">{metric.name}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Actual</label>
                            <input type="number" value={metric.actual} onChange={e => handleDataEdit(index, 'actual', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Target</label>
                            <input type="number" value={metric.target} onChange={e => handleDataEdit(index, 'target', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Category: {metric.category}</span>
                          <span className={`font-medium ${metric.actual / metric.target >= 0.9 ? 'text-green-400' : metric.actual / metric.target >= 0.7 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {Math.round(metric.actual / metric.target * 100)}%
                          </span>
                        </div>
                      </div>
                    </MatteCard>)}
                </div>

                <div className="flex space-x-3">
                  <button onClick={handleCancelEdit} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSaveData} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#E20074] to-[#20074] text-white rounded-lg font-medium hover:from-[#C21E68] hover:to-[#1A0660] transition-all shadow-lg">
                    Save Data
                  </button>
                </div>
              </MatteCard>
            </motion.div>
          </div>}

        {isExtracting && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <MatteCard className="p-8 text-center" variant="accent">
              <div className="animate-spin w-8 h-8 border-2 border-[#E20074] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">Processing image...</p>
            </MatteCard>
          </div>}
      </div>
    </div>;
  const renderCatchUp = () => <CatchUpView viewMode={viewMode} onViewModeChange={setViewMode} />;
  const renderShift = () => <ShiftView onNavigateToCatchUp={metric => {
    setCurrentScreen('catchup');
    // TODO: Pass metric to CatchUpView for preselection
  }} />;
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'dashboard':
        return renderDashboard();
      case 'catchup':
        return renderCatchUp();
      case 'shift':
        return renderShift();
      case 'metrics':
        return renderMetrics();
      case 'upload':
        return renderUpload();
      case 'daily':
        return renderShift();
      // Add daily case routing to shift view
      default:
        return renderDashboard();
    }
  };
  return <div className="relative">
      <AnimatePresence mode="wait">
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
      }}>
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>

      {currentScreen !== 'welcome' && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}

      {showToast && <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 50
    }} className="fixed bottom-24 left-4 right-4" style={{ zIndex: 45 }}>
          <MatteCard className="p-4" variant="accent">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-white">
                {extractedData ? 'Data saved successfully!' : 'Metrics extracted successfully!'}
              </p>
            </div>
          </MatteCard>
        </motion.div>}
    </div>;
};
export default PerformanceTrackerApp;