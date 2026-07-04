const fs = require('fs');
let content = fs.readFileSync('src/components/AdvisorPanel.tsx', 'utf8');

const stateTarget = `const [activeTab, setActiveTab] = useState<'certs' | 'activities' | 'profile'>('certs');`;
const stateReplace = `const [activeTab, setActiveTab] = useState<'certs' | 'activities' | 'profile' | 'portfolio'>('certs');`;
content = content.replace(stateTarget, stateReplace);

const tabTarget = `              <button
                onClick={() => setActiveTab('profile')}
                className={\`flex items-center gap-2 px-6 py-2.5 border-b-2 font-medium text-xs transition-all duration-200 cursor-pointer \${
                  activeTab === 'profile'
                    ? 'border-tu-red text-tu-red font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }\`}
              >
                <Users size={14} />
                View Full Profile
              </button>
            </div>`;

const tabReplace = `              <button
                onClick={() => setActiveTab('profile')}
                className={\`flex items-center gap-2 px-6 py-2.5 border-b-2 font-medium text-xs transition-all duration-200 cursor-pointer \${
                  activeTab === 'profile'
                    ? 'border-tu-red text-tu-red font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }\`}
              >
                <Users size={14} />
                Student Demographics
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={\`flex items-center gap-2 px-6 py-2.5 border-b-2 font-medium text-xs transition-all duration-200 cursor-pointer \${
                  activeTab === 'portfolio'
                    ? 'border-tu-red text-tu-red font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }\`}
              >
                <FileText size={14} />
                Full Portfolio (16 Sections)
              </button>
            </div>`;
content = content.replace(tabTarget, tabReplace);

const renderTarget = `              {/* VIEW FULL PROFILE TAB */}
              {activeTab === 'profile' && (
                <div
                  className="space-y-4"
                >
                  <StudentInformation
                    currentUser={activeStudent}
                    portfolioData={selectedStudentPortfolio}
                    certificates={certificates}
                    activities={activities}
                    configOptions={[]}
                    onUpdateProfile={async () => {}}
                    onAddCertificate={async () => {}}
                    onAddActivity={async () => {}}
                    isReadOnly={true}
                  />
                </div>
              )}`;

const renderReplace = `              {/* VIEW FULL PROFILE TAB */}
              {activeTab === 'profile' && (
                <div
                  className="space-y-4"
                >
                  <StudentInformation
                    currentUser={activeStudent}
                    portfolioData={selectedStudentPortfolio}
                    certificates={certificates}
                    activities={activities}
                    configOptions={[]}
                    onUpdateProfile={async () => {}}
                    onAddCertificate={async () => {}}
                    onAddActivity={async () => {}}
                    isReadOnly={true}
                  />
                </div>
              )}
              {activeTab === 'portfolio' && selectedStudentPortfolio && (
                <div className="space-y-4 bg-white p-2 rounded-2xl">
                  <EditPortfolio
                    currentUser={activeStudent}
                    portfolioData={selectedStudentPortfolio}
                    certificates={certificates}
                    configOptions={[]}
                    onSavePortfolio={async () => {}}
                    isReadOnly={true}
                  />
                </div>
              )}`;

content = content.replace(renderTarget, renderReplace);

fs.writeFileSync('src/components/AdvisorPanel.tsx', content);
console.log("Done");
