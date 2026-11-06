import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Percent, 
  Bell, 
  RotateCcw, 
  Save, 
  Award,
  ExternalLink
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();

  const [companyName, setCompanyName] = useState('Unlimited Construction');
  const [ownerName, setOwnerName] = useState('Nancy Paramo');
  const [licenseNumber, setLicenseNumber] = useState('1040445');
  const [licenseClass, setLicenseClass] = useState('Class B - General Building Contractor');
  const [phone, setPhone] = useState('(951) 609-7164');
  const [email, setEmail] = useState('unlimitedconstruction@mail.com');
  const [address, setAddress] = useState('4193 Flat Rock Dr, Suite 200-435');
  const [cityZip, setCityZip] = useState('Riverside, CA 92505');

  // Rates
  const [defaultMarkup, setDefaultMarkup] = useState('15');
  const [contingencyPercent, setContingencyPercent] = useState('10');
  const [hourlyLaborRate, setHourlyLaborRate] = useState('85');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Company profile and operational rates updated.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo project, lead, and change order data to initial factory state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Company & Licensing Verification Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>California Contractor License Verification</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                California Contractors State License Board (CSLB) credentials
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active & Bonded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Entity</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner & Responsible Managing Officer (RMO)</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">California License #</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">License Classification</label>
              <input
                type="text"
                value={licenseClass}
                onChange={(e) => setLicenseClass(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-start gap-3 text-xs text-brand-900">
            <Award className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Owner Biography:</strong> Nancy Paramo transitioned into general contracting with a commitment to integrity, daily on-site supervision, and open client communication after experiencing a contractor abandonment on her own home remodel.
            </div>
          </div>
        </div>

        {/* Office & Regional Locations */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Headquarters & Southern California Service Territory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Office Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City, State & Zip</label>
              <input
                type="text"
                value={cityZip}
                onChange={(e) => setCityZip(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Direct Phone / Text</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700">Covered Counties: </span>
            Riverside County, San Bernardino County, Orange County, San Diego County, Mountain Communities.
          </div>
        </div>

        {/* Default Pricing & Margins */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Estimate Pricing Engine & Default Margins
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contractor Overhead & Markup (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={defaultMarkup}
                  onChange={(e) => setDefaultMarkup(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold pr-8"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Standard Contingency Buffer (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold pr-8"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Hourly Labor Rate ($/hr)</label>
              <div className="relative">
                <input
                  type="number"
                  value={hourlyLaborRate}
                  onChange={(e) => setHourlyLaborRate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
