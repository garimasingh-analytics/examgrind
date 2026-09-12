-- Delhi Police Constable: complete every shallow chapter left by the first
-- taxonomy pass. The acceptance rule for this route is that no public chapter
-- has fewer than four drill-down pages. This is additive and preserves all
-- existing learner evidence.

with raw(subject_id, chapter_slug, name, slug, ord) as (values
  -- Computer awareness
  ('dp-computer','computer-basics-generations','Characteristics and Uses of Computers','computer-characteristics-uses',2),('dp-computer','computer-basics-generations','Classification of Computers','computer-classification',3),('dp-computer','computer-basics-generations','Computer Generations: Key Features','computer-generations-key-features',4),
  ('dp-computer','software-operating-systems','Operating System Functions','operating-system-functions-deep',2),('dp-computer','software-operating-systems','Application and Utility Software','application-utility-software',3),('dp-computer','software-operating-systems','Open-source, Proprietary and Licences','software-licences',4),
  ('dp-computer','number-systems-data-representation','Bits, Bytes and Storage Units','bits-bytes-storage-units-deep',2),('dp-computer','number-systems-data-representation','Binary and Decimal Conversion','binary-decimal-conversion',3),('dp-computer','number-systems-data-representation','Characters, Codes and Data Types','characters-codes-data-types',4),
  ('dp-computer','internet-web-email','Browser, Search Engine and URL','browser-search-engine-url',3),('dp-computer','internet-web-email','E-mail Fields and Attachments','email-fields-attachments',4),
  ('dp-computer','networks-communication','LAN, MAN, WAN and Topologies','lan-man-wan-topologies',2),('dp-computer','networks-communication','Network Devices','network-devices',3),('dp-computer','networks-communication','Communication Media and Protocols','communication-media-protocols',4),
  ('dp-computer','cyber-security-digital-safety','Malware and Antivirus','malware-antivirus-deep',2),('dp-computer','cyber-security-digital-safety','Phishing, Passwords and MFA','phishing-passwords-mfa',3),('dp-computer','cyber-security-digital-safety','Safe Browsing and Digital Privacy','safe-browsing-digital-privacy',4),
  ('dp-computer','ms-word','Word Interface and File Operations','word-interface-file-operations',2),('dp-computer','ms-word','Text, Paragraph and Page Formatting','word-text-paragraph-page-formatting',3),('dp-computer','ms-word','Tables, Mail Merge and Print','word-tables-mail-merge-print',4),
  ('dp-computer','ms-excel','Cells, References and Formulas','excel-cells-references-formulas',3),('dp-computer','ms-excel','Functions, Sorting and Filtering','excel-functions-sorting-filtering',4),
  ('dp-computer','ms-powerpoint-keyboard-shortcuts','Slides, Themes and Views','powerpoint-slides-themes-views',3),('dp-computer','ms-powerpoint-keyboard-shortcuts','Transitions, Animation and Slide Show','powerpoint-transitions-animation-slide-show',4),
  -- General knowledge and current affairs
  ('dp-gk','indian-art-culture','Classical and Folk Dance','classical-folk-dance',3),('dp-gk','indian-art-culture','Music, Painting and Architecture','music-painting-architecture',4),
  ('dp-gk','world-geography-environment','Latitude, Longitude and Time Zones','latitude-longitude-time-zones',3),('dp-gk','world-geography-environment','Landforms, Climate and Ocean Currents','landforms-climate-ocean-currents',4),
  ('dp-gk','governance-public-institutions','Constitutional and Statutory Bodies','constitutional-statutory-bodies',3),('dp-gk','governance-public-institutions','Government Schemes and Citizen Services','government-schemes-citizen-services',4),
  ('dp-gk','indian-economy','Budget, Taxation and Public Finance','budget-taxation-public-finance-deep',3),('dp-gk','indian-economy','Sectors, Trade and Development Indicators','sectors-trade-development-indicators',4),
  ('dp-gk','everyday-physics','Measurement, Units and Motion','measurement-units-motion',3),('dp-gk','everyday-physics','Heat, Light, Sound and Electricity','heat-light-sound-electricity-deep',4),
  ('dp-gk','everyday-chemistry','Atoms, Molecules and Periodic Table','atoms-molecules-periodic-table',3),('dp-gk','everyday-chemistry','Metals, Non-metals and Daily Materials','metals-nonmetals-daily-materials',4),
  ('dp-gk','biology-human-health','Plant and Animal Cell Basics','plant-animal-cell-basics',3),('dp-gk','biology-human-health','Human Body Systems','human-body-systems',4),
  ('dp-gk','technology-space-defence','Indian Space Missions','indian-space-missions',2),('dp-gk','technology-space-defence','Defence Exercises and Organisations','defence-exercises-organisations',3),('dp-gk','technology-space-defence','Digital India and Emerging Technology','digital-india-emerging-technology',4),
  ('dp-gk','sports-awards-books','Major Sports Tournaments','major-sports-tournaments',2),('dp-gk','sports-awards-books','National and International Awards','national-international-awards',3),('dp-gk','sports-awards-books','Books, Authors and Important Days','books-authors-important-days',4),
  -- Numerical ability
  ('dp-quant','hcf-lcm-surds-indices','Prime Factorisation and Divisibility','prime-factorisation-divisibility',3),('dp-quant','hcf-lcm-surds-indices','Laws of Indices and Simplification','laws-of-indices-simplification',4),
  ('dp-quant','decimals-fractions-recurring-values','Fraction-Decimal Conversion','fraction-decimal-conversion',2),('dp-quant','decimals-fractions-recurring-values','Recurring Decimals and Comparison','recurring-decimals-comparison',3),('dp-quant','decimals-fractions-recurring-values','Operations and Approximation','decimal-fraction-operations-approximation',4),
  ('dp-quant','ratio-proportion-partnership','Direct and Inverse Proportion','direct-inverse-proportion',3),('dp-quant','ratio-proportion-partnership','Mixture and Alligation','mixture-alligation',4),
  ('dp-quant','simple-compound-interest','Principal, Rate and Time','principal-rate-time',3),('dp-quant','simple-compound-interest','Compound Interest Growth','compound-interest-growth',4),
  ('dp-quant','pipes-cisterns','Efficiency and Work Rates','efficiency-work-rates',2),('dp-quant','pipes-cisterns','Inlet, Outlet and Leakage','inlet-outlet-leakage',3),('dp-quant','pipes-cisterns','Combined Work Problems','combined-work-problems',4),
  ('dp-quant','time-speed-distance','Speed Conversion and Relative Speed','speed-conversion-relative-speed',3),('dp-quant','time-speed-distance','Average Speed Applications','average-speed-applications-deep',4),
  ('dp-quant','trains-boats-streams','Boats and Streams','boats-streams-deep',4),
  ('dp-quant','algebra','Algebraic Identities','algebraic-identities',2),('dp-quant','algebra','Linear Equations','linear-equations',3),('dp-quant','algebra','Quadratic and Factorisation Basics','quadratic-factorisation-basics',4),
  ('dp-quant','geometry','Lines, Angles and Triangles','lines-angles-triangles-deep',3),('dp-quant','geometry','Quadrilaterals and Circles','quadrilaterals-circles-deep',4),
  ('dp-quant','mensuration','2D Perimeter and Area','two-d-perimeter-area',3),('dp-quant','mensuration','3D Surface Area and Volume','three-d-surface-area-volume',4),
  ('dp-quant','trigonometry-heights-distances','Trigonometric Ratios and Identities','trigonometric-ratios-identities-deep',3),('dp-quant','trigonometry-heights-distances','Heights and Distances','heights-distances-deep',4),
  -- Reasoning
  ('dp-reasoning','word-formation-dictionary-order','Letter Positions and Word Formation','letter-positions-word-formation',2),('dp-reasoning','word-formation-dictionary-order','Dictionary and Alphabetical Order','dictionary-alphabetical-order',3),('dp-reasoning','word-formation-dictionary-order','Meaningful Word Arrangement','meaningful-word-arrangement',4),
  ('dp-reasoning','directions-distance','Distance and Final Position','distance-final-position-deep',3),('dp-reasoning','directions-distance','Shortest Route and Coordinate Method','shortest-route-coordinate-method',4),
  ('dp-reasoning','blood-relations','Family Tree Relations','family-tree-relations-deep',3),('dp-reasoning','blood-relations','Coded and Pointing Relations','coded-pointing-relations-deep',4),
  ('dp-reasoning','ranking-order-seating','Linear Seating Arrangement','linear-seating-arrangement',4),
  ('dp-reasoning','venn-set-relations','Set Overlap and Classification','set-overlap-classification-deep',3),('dp-reasoning','venn-set-relations','Counting in Venn Diagrams','counting-venn-diagrams-deep',4),
  ('dp-reasoning','syllogism-statement-logic','Statements and Conclusions','statements-conclusions-deep',4),
  ('dp-reasoning','calendar-clock-age','Calendar and Day Calculation','calendar-day-calculation',2),('dp-reasoning','calendar-clock-age','Clock Angles and Time','clock-angles-time',3),('dp-reasoning','calendar-clock-age','Age Equations','age-equations',4),
  ('dp-reasoning','mathematical-operations','Operator Substitution','operator-substitution-deep',2),('dp-reasoning','mathematical-operations','Equation Balance and Missing Values','equation-balance-missing-values',3),('dp-reasoning','mathematical-operations','Rule Check Before Calculation','rule-check-before-calculation-deep',4),
  ('dp-reasoning','figure-analogy-classification','Figure Analogy','figure-analogy-deep',3),('dp-reasoning','figure-analogy-classification','Figure Completion and Classification','figure-completion-classification',4),
  ('dp-reasoning','mirror-water-embedded-figures','Mirror Images','mirror-images-deep',3),('dp-reasoning','mirror-water-embedded-figures','Water Images and Embedded Figures','water-images-embedded-figures',4),
  ('dp-reasoning','paper-folding-cube-dice','Paper Folding and Cutting','paper-folding-cutting-deep',3),('dp-reasoning','paper-folding-cube-dice','Cube and Dice Rules','cube-dice-rules-deep',4)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.name, r.slug,
       format('Build %s for Delhi Police Constable objective practice.', r.name), r.ord
from raw r
join public.chapters c on c.subject_id=r.subject_id and c.slug=r.chapter_slug
on conflict (chapter_id, slug) do update set name=excluded.name, description=excluded.description, order_index=excluded.order_index;
