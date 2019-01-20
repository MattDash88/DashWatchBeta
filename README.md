Dash Watch Beta Website by MattDash
            <div className="aboutHeader">Changelog v0.9.3</div>
            <li>Added temporary /reports page for January cycle</li>
            <li>Fixed minor issue with Completion Date title not showing on modal</li>
            <div className="aboutHeader">Changelog v0.9.2</div>
            <li>Added redirector for shorter and nicer links to reports</li>
            <li>Added (anonymous) Google Analytics. This is for internal use to determine what aspects of our work site users are most interested in.</li>
            <li>Fixed a small issue with the browser Edge not showing the correct colour.</li>
            <div className="aboutHeader">Changelog v0.9.1</div>
            Other
            <li>Added header to Proposal List</li>
            <li>Fixed some bugs in the colour coding of some KPI metrics</li>
            <li>Improved outlining of images on Navbar and Month page</li>
            <li>Added API call for internal Dash Watch project</li>
            <li>A couple of other fixes and improvements.</li>
            <br>
            <div className="aboutHeader">Changelog v0.9</div>
            Proposal List Page
            <li>Added filter for opted out and reporting concluded proposals.</li>
            <li>Added title and counter at top of proposal list page</li>            
            Month Page
            <li>The Month page can now show report lists from previous months.</li>
            <li>Added support for videos</li>
            <li>Added icon to indicate whether an item is a pdf or video</li>
            Single Proposal Page
            <li>Added styling to Performance and Funding elements, for example "Not Provided" will now show up red.</li>
            <li>Video reports added to the report tab</li>
            Back-end
            <li>Airtable data requests were moved to their own file. Each of the 8 tables used now has its own function and cache making data retrieval much more flexible</li>
            <li>Back-end sorting functions were moved to their own file, cleaning up the code and they can now be reused.</li>
            <li>Data elements are now grouped per tab, main_data, kpi_data, financial_data, report_data and list_data. This significantly simplifies handover of data between pages and maintanability.</li>
            <li>Searches and proposal page requests are now handled on the server side</li>
            <li>Search query altered to allow filtering</li>
            <li>Month overview data has been prepared to handle multiple months.</li>
            <li>Included Proposal Owner in the main table, this removes the dependency on the "Proposal Owner" reducing the number of queries to Airtable.</li>
            Other
            <li>Fixed a bug in the Social Media KPIs where "new likes" actually showed the metric for "new comments"</li>
            <li>Fixed issue that searching before the data was loaded would return no results.</li>
            <li>Changed estimated completion to anticipated completion to better match reports.</li>
            <li>Added indicator to Navbar highlighting the page the user is on.</li>
            <li>Added scroll to top button on potentially long pages</li>
            <li>Many other small styling tweaks and code improvements.</li>
            <br>