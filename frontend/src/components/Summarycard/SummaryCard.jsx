import "./SummaryCard.css";

function SummaryCard({ title, value, icon, subtitle }) {
    return (
        <div className="summary-card">
            <div className="summary-top">
                <span className="summary-title">{title}</span>
                <div className="summary-icon">
                    {icon}
                </div>
            </div>
            <div className="summary-value-row">
                <span className="summary-value">{value ?? 0}</span>
                {subtitle && <span className="summary-subtitle">{subtitle}</span>}
            </div>
        </div>
    );
}

export default SummaryCard;