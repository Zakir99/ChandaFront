import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Calendar,
  Users,
  CheckCircle,
  ChevronLeft,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Config from "../../Js/Config";




const SummaryCard = ({ title, value, color }) => {
  return (
    <div className={`${color} p-3 md:p-4 rounded-xl border`}>
      <div className="text-xs md:text-sm font-medium mb-1">{title}</div>
      <div className="text-lg md:text-2xl font-bold truncate">{value}</div>
    </div>
  );
}

const UnpaidListView = () => {
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const filtered = mockData?.unpaidFamilies?.list?.filter(
  //     (family) =>
  //       family?.familyName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
  //       family?.headMember?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  //   );
  //   setFilteredFamilies(filtered);
  // }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-3 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Unpaid Families
              </h1>
              <p className="text-sm text-gray-600">
                {filteredFamilies?.length ?? 0} families
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search families..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryCard
            title="Total Due"
            value={`${mockData?.unpaidFamilies?.totalDue?.toLocaleString()}`}
            color="bg-red-50 text-red-700 border-red-200"
          />
          <SummaryCard
            title="Avg Months"
            value="1.5 months"
            color="bg-yellow-50 text-yellow-700 border-yellow-200"
          />
          <SummaryCard
            title=">2 Months"
            value="8 families"
            color="bg-orange-50 text-orange-700 border-orange-200"
          />
        </div>

        {/* Unpaid Families List */}
        <div className="space-y-3">
          {filteredFamilies?.map((family) => (
            <div
              key={family.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 active:bg-gray-50 transition-colors"
              onClick={() => onViewFamily(family)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">
                    {family.familyName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {family.headMember}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <div className="text-lg md:text-xl font-bold text-red-700 whitespace-nowrap">
                    {family.totalDue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {family.monthsUnpaid} months
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{family.membersUnpaid} members unpaid</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Oldest: {family.oldestUnpaidMonth}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={`tel:${family.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 active:scale-95 transition-transform text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${family.phone.replace(/\D/g, "")}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 active:scale-95 transition-transform text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFamilies?.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              No unpaid families match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



export default UnpaidListView;
