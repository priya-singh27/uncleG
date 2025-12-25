function ContributionGraph({ weeks }) {
    if (!weeks || weeks.length === 0) return null;

    // Get max contribution for scaling
    const maxContrib = Math.max(...weeks.flat(), 1);

    // Get color intensity based on contribution count
    const getColor = (count) => {
        if (count === 0) return 'var(--graph-empty)';
        const intensity = Math.min(count / maxContrib, 1);
        if (intensity < 0.25) return 'var(--graph-low)';
        if (intensity < 0.5) return 'var(--graph-medium)';
        if (intensity < 0.75) return 'var(--graph-high)';
        return 'var(--graph-max)';
    };

    return (
        <div className="contribution-graph">
            <div className="contribution-graph__grid">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="contribution-graph__week">
                        {week.map((count, dayIndex) => (
                            <div
                                key={dayIndex}
                                className="contribution-graph__day"
                                style={{ backgroundColor: getColor(count) }}
                                title={`${count} contributions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContributionGraph;
