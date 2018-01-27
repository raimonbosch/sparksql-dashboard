var queries = [{"query": "                 SELECT                     sum_sessions as total_sesiones,                     date as x                 FROM googleanalytics_by_date                 ORDER BY date asc                 ", "id": "0", "name": "Total sessions"}, {"indexed": true, "shared": true, "query": "                 SELECT                     sum_sessions as sessions_today,                     date_format(date, 'EE, dd MMM yyyy') as x                 FROM googleanalytics_by_date                 WHERE date >= date_add('%DATE%', -7)                     AND date <=  date_add('%DATE%', -1)                 ORDER BY date asc;                  SELECT                     sum_sessions as sessions_last_week,                     date_format(date, 'EE, dd MMM yyyy') as x                 FROM googleanalytics_by_date                 WHERE date >= date_add('%DATE%', -14)                     AND date <=  date_add('%DATE%', -8)                 ORDER BY date asc                 ", "id": "1", "name": "Last week vs week before"}, {"indexed": true, "shared": true, "query": "                 SELECT                     sum_sessions as sessions_today,                     date_format(date, 'EE, dd MMM yyyy') as x                 FROM googleanalytics_by_date                 WHERE date >= date_add('%DATE%', -91)                     AND date <=  date_add('%DATE%', -1)                 ORDER BY date asc;                  SELECT                     sum_sessions as sessions_year_before,                     date_format(date, 'EE, dd MMM yyyy') as x                 FROM googleanalytics_by_date                 WHERE date >= date_add('%DATE%', -455)                     AND date <=  date_add('%DATE%', -365)                 ORDER BY date asc                 ", "id": "2", "name": "Last 90 days vs year before"}, {"query": "                 SELECT                     sum(clicks) as clicks_totales,                     date as x from searchanalytics                 GROUP BY date                 ORDER BY date asc                 ", "id": "3", "name": "Total clicks"}, {"query": "                 SELECT                     100*(sum(sessions)/(SELECT sum(sessions) FROM googleanalytics WHERE url like '%/parties%' )) as perc,                     url as x                 FROM googleanalytics                 WHERE url like '%/parties%'                 GROUP BY url                 ORDER BY perc desc                 LIMIT 100                 ", "id": "8", "name": "Top 100 queries parties"}, {"query": "                 SELECT                     100*(sum(sessions)/(SELECT sum(sessions) FROM googleanalytics WHERE url like '%/live-music%' )) as perc,                     url as x                 FROM googleanalytics                 WHERE url like '%/live-music%'                 GROUP BY url                 ORDER BY perc desc                 LIMIT 100                 ", "id": "9", "name": "Top 100 queries live music"}, {"shared": true, "query": "                 SELECT                     sum(sessions) as sessions_today,                     site as x                  FROM googleanalytics                  WHERE date >= date_add('%DATE%', -7)                      AND date <= date_add('%DATE%', -1)                  GROUP BY                      site                  ORDER BY sessions_today DESC;                   SELECT                      sum(sessions) as sessions_last_week,                      site as x                  FROM googleanalytics                  WHERE date >= date_add('%DATE%', -14)                      AND date <= date_add('%DATE%', -8)                  GROUP BY site                  ORDER BY  sessions_last_week DESC                  ", "type": "column", "id": "10", "name": "This week vs Last week (by site)"}, {"indexed": true, "query": "                 SELECT                     a.x as 00_site,                     sessions_yesterday as 01_yesterday,                     round(100*((sessions_yesterday - sessions_one_week_ago) / sessions_one_week_ago), 2) as 02_diff_day,                     sessions_this_week as 03_this_week,                     round(100*((sessions_this_week - sessions_last_week) / sessions_last_week), 2) as 04_diff_week,                     sessions_this_month as 05_this_month,                     round(100*((sessions_this_month - sessions_this_month_one_year_ago) / sessions_this_month_one_year_ago), 2) as 06_diff_month,                     sessions_last_three_months as 07_last_three_months,                     round(100*((sessions_last_three_months - sessions_last_three_months_one_year_ago) / sessions_last_three_months_one_year_ago), 2) as 08_diff_three_months                 FROM (                     SELECT                         sum(sum_sessions) as sessions_this_week,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -7)                         AND date <= date_add('%DATE%', -1)                     GROUP BY site                     ORDER BY sessions_this_week DESC) a,                     (                     SELECT                         sum(sum_sessions) as sessions_last_week,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -14)                         AND date <= date_add('%DATE%', -8)                     GROUP BY site                     ORDER BY sessions_last_week DESC) b,                     (                     SELECT                         sum(sum_sessions) as sessions_yesterday,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -2)                         AND date <= date_add('%DATE%', -1)                     GROUP BY site                     ORDER BY sessions_yesterday DESC) c,                     (                     SELECT                         sum(sum_sessions) as sessions_one_week_ago,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -9)                         AND date <= date_add('%DATE%', -8)                     GROUP BY site                     ORDER BY sessions_one_week_ago DESC) d,                     (                     SELECT                         sum(sum_sessions) as sessions_this_month,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -31)                         AND date <= date_add('%DATE%', -1)                     GROUP BY site                     ORDER BY sessions_this_month DESC) e,                     (                     SELECT                         sum(sum_sessions) as sessions_this_month_one_year_ago,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -396)                         AND date <= date_add('%DATE%', -365)                     GROUP BY site                     ORDER BY sessions_this_month_one_year_ago DESC) f,                     (                     SELECT                         sum(sum_sessions) as sessions_last_three_months,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -91)                         AND date <= date_add('%DATE%', -1)                     GROUP BY site                     ORDER BY sessions_last_three_months DESC) g,                     (                     SELECT                         sum(sum_sessions) as sessions_last_three_months_one_year_ago,                         site as x                     FROM googleanalytics_by_date_site                     WHERE date >= date_add('%DATE%', -456)                         AND date <= date_add('%DATE%', -365)                     GROUP BY site                     ORDER BY sessions_last_three_months_one_year_ago DESC) h                 WHERE a.x = b.x                     AND b.x = c.x                     AND c.x = d.x                     AND d.x = e.x                     AND e.x = f.x                     AND f.x = g.x                     AND g.x = h.x                 ", "type": "column", "id": "11", "name": "Summary increases of traffic by site"}, {"name": "Last week vs week before (in one site)", "filter": {"site": "%SITE%"}, "query": "                   SELECT                     sum_sessions as sessions_today,                     date_format(date, 'EE, dd MMM yyyy') as x,                     site                 FROM googleanalytics_by_date_site                 WHERE date >= date_add('%DATE%', -7)                     AND date <=  date_add('%DATE%', -1)                 ORDER BY date asc;                  SELECT                     sum_sessions as sessions_last_week,                     date_format(date, 'EE, dd MMM yyyy') as x,                     site                 FROM googleanalytics_by_date_site                 WHERE date >= date_add('%DATE%', -14)                     AND date <=  date_add('%DATE%', -8)                 ORDER BY date asc                 ", "indexed": true, "shared": true, "id": "12"}, {"name": "Last 90 days vs year before (in one site)", "filter": {"site": "%SITE%"}, "query": "                 SELECT                     sum_sessions as sessions_today,                     date_format(date, 'EE, dd MMM yyyy') as x,                     site                 FROM googleanalytics_by_date_site                 WHERE date >= date_add('%DATE%', -91)                     AND date <=  date_add('%DATE%', -1)                 ORDER BY date asc;                  SELECT                     sum_sessions as sessions_year_before,                     date_format(date, 'EE, dd MMM yyyy') as x,                     site                 FROM googleanalytics_by_date_site                 WHERE date >= date_add('%DATE%', -455)                     AND date <=  date_add('%DATE%', -365)                 ORDER BY date asc                 ", "indexed": true, "shared": true, "id": "13"}, {"indexed": true, "shared": true, "query": "                     SELECT                          sum(sum_sessions) as sessions_2017,                          date_format(date, 'yyyy-MM') as x                      FROM googleanalytics_by_date                      WHERE date >= '2017-01-01'                          AND date <=  '2017-12-31'                      GROUP BY date_format(date, 'yyyy-MM')                      ORDER BY date_format(date, 'yyyy-MM') asc;                       SELECT                          sum(sum_sessions) as sessions_2016,                          date_format(date, 'yyyy-MM') as x                      FROM googleanalytics_by_date                      WHERE date >= '2016-01-01'                          AND date <= '2016-12-31'                      GROUP BY date_format(date, 'yyyy-MM')                      ORDER BY date_format(date, 'yyyy-MM') asc                      ", "id": "30", "name": "Last year vs year before (total, month by month)"}, {"indexed": true, "query": "                 SELECT                      this_year.site AS 00_site,                      this_year.sessions AS 01_year_sessions_this_year,                      round(100*((this_year.sessions - last_year.sessions) / last_year.sessions), 2) AS 02_diff_year,                      last_year.sessions AS 03_year_sessions_last_year                  FROM (SELECT                          sum(sum_sessions) as sessions,                          site                      FROM googleanalytics_by_date_site                      WHERE date >= '2017-01-01'                          AND date <=  '2017-12-31'                      GROUP BY site) this_year,                      (SELECT                          sum(sum_sessions) as sessions,                          site                      FROM googleanalytics_by_date_site                      WHERE date >= '2016-01-01'                          AND date <=  '2016-12-31'                      GROUP BY site) last_year                  WHERE this_year.site = last_year.site                  ORDER BY this_year.sessions DESC                  ", "type": "column", "id": "31", "name": "Summary anual increases of traffic by site"}, {"name": "Last year vs year before (in one site, month by month)", "filter": {"site": "%SITE%"}, "query": "                     SELECT                          sum(sum_sessions) as sessions_2017,                          date_format(date, 'yyyy-MM') as x,                          site                      FROM googleanalytics_by_date_site                      WHERE date >= '2017-01-01'                          AND date <=  '2017-12-31'                      GROUP BY site, date_format(date, 'yyyy-MM')                      ORDER BY site, date_format(date, 'yyyy-MM') asc;                       SELECT                          sum(sum_sessions) as sessions_2018,                          date_format(date, 'yyyy-MM') as x,                          site                      FROM googleanalytics_by_date_site                      WHERE date >= '2016-01-01'                          AND date <=  '2016-12-31'                      GROUP BY site, date_format(date, 'yyyy-MM')                      ORDER BY site, date_format(date, 'yyyy-MM') asc                      ", "indexed": true, "shared": true, "id": "32"}];