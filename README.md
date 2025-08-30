# Reddit Insights Dashboard

A comprehensive React dashboard for analyzing and visualizing Reddit subreddit data with interactive charts, filtering, and export capabilities.

## Features

### 📊 Data Visualization
- **Overview Dashboard**: Key metrics, subreddit distribution, activity patterns
- **Interactive Charts**: Built with Recharts for responsive, interactive visualizations
- **Top Posts Table**: Sortable, searchable table with pagination and external links
- **Trending Analysis**: Word frequency analysis, topic distribution, subreddit-specific insights
- **Growth Trends**: Time-series analysis with customizable date ranges
- **Subreddit Comparison**: Multi-dimensional performance comparison tools

### 🔍 Advanced Filtering
- **Global Filter System**: Affects all dashboard components simultaneously
- **Date Range Filters**: Last 7/30/90 days or all-time data
- **Subreddit Multi-Select**: Filter by specific communities
- **Search Functionality**: Full-text search across posts, authors, and content
- **Sort Options**: Top, Hot, New, Rising algorithms

### 📤 Export Capabilities
- **CSV Export**: Raw data export for external analysis
- **Excel Export**: Formatted spreadsheet export
- **PDF Reports**: Summary reports with key insights
- **Screenshot Export**: Visual dashboard captures

### 🎨 Modern UI/UX
- **Dark/Light Mode**: System-aware theme switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Hover states, tooltips, and smooth animations
- **Accessible**: WCAG compliant with proper ARIA labels

## Tech Stack

- **Frontend**: React 18, Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Charts**: Recharts for data visualization
- **TypeScript**: Full type safety throughout
- **Data Processing**: Custom utilities for CSV parsing and analysis

## Data Format

The dashboard expects CSV files with the following columns:

\`\`\`csv
post_id,title,author_username,author_profile_link,author_flair,subreddit_name,post_url,post_content,post_flair,score,num_comments,upvote_ratio,awards,is_nsfw,is_spoiler,edited,media_links,permalink,distinguished,url,domain,is_self,is_video,crosspost_parent,locked,stickied,suggested_sort,view_count,created_utc_timestamp,created_utc_human
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd reddit-insights-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Upload Data**: Click "Upload Data" and select your CSV file
2. **Apply Filters**: Use the filter panel to narrow down your analysis
3. **Explore Insights**: Navigate through different dashboard tabs
4. **Export Results**: Use export options to save your analysis

## Dashboard Sections

### Overview
- Total posts, authors, and engagement metrics
- Subreddit distribution pie chart
- Activity patterns by hour
- Top contributors and recent activity timeline

### Top Posts
- Sortable table with post titles, scores, comments
- Direct links to Reddit posts
- Advanced search and filtering
- Pagination for large datasets

### Trends
- Word frequency analysis and trending topics
- Topic distribution across subreddits
- Subreddit-specific word patterns
- Visual word cloud alternative

### Growth
- Post volume trends over time
- Engagement rate evolution
- Cumulative growth visualization
- Customizable time ranges

### Compare
- Side-by-side subreddit performance
- Multi-dimensional radar charts
- Activity timeline comparisons
- Interactive subreddit selection

## Data Processing

The dashboard includes robust data processing utilities:

- **CSV Parsing**: Handles various CSV formats and encodings
- **Data Validation**: Ensures data integrity and type safety
- **Statistical Analysis**: Calculates engagement metrics and trends
- **Text Processing**: Word extraction with stop-word filtering
- **Time Series**: Groups data by day/week/month for trend analysis

## Customization

### Adding New Metrics
1. Update the `RedditPost` interface in `lib/types.ts`
2. Modify data processing functions in `lib/data-processing.ts`
3. Create new chart components in the `components/` directory

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration for custom colors
- Use shadcn/ui components for consistent design

### Export Formats
- Extend `lib/export-utils.ts` for new export formats
- Add new export buttons in the filter panel
- Implement custom report templates

## Performance Considerations

- **Lazy Loading**: Charts render only when visible
- **Memoization**: Expensive calculations are cached
- **Pagination**: Large datasets are paginated for performance
- **Debounced Search**: Search queries are debounced to reduce re-renders

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Contact

### Get in Touch

**Derrick Karanja** - Software Developer

- 📧 **Email**: [derricks01.kk@outlook.com](mailto:derricks01.kk@outlook.com)
- 💼 **LinkedIn**: [linkedin.com/in/derks01](https://linkedin.com/in/derks01)
- 🐱 **GitHub**: [github.com/derksKCodes](https://github.com/derksKCodes)
- 🌐 **My Portfolio**: [My Portfolio](https://my-portfolio-project-dk-jr.vercel.app/)

### Project Links

- 🌐 **Live Demo**: [my-portfolio-project-dk-jr.vercel.app/](https://my-portfolio-project-dk-jr.vercel.app/)
- 📁 **Repository**: [github.com/derksKCodes/derrickportfolio.git](https://github.com/derksKCodes/derrickportfolio.git)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Derrick](https://github.com/derksKCodes)

</div>

---
