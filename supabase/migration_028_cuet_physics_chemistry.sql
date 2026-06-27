-- Migration 028 — CUET Physics + Chemistry topic rebuild
--
-- Continues the CUET rebuild started in 026 (English + GT) and 027 (Math).
-- Together with 027 this completes CUET STEM, covering all PCM aspirants.
--
-- Physics: 20 chapters × 6 topics = 120 rows
-- Chemistry: 29 chapters × 6 topics = 174 rows
-- Total: 294 quality NCERT-aligned topic rows.
--
-- Authoring approach: same as 027 — topic names match how NCERT divides
-- the chapter AND how CUET PYQs frame their buckets. Joined by chapter NAME
-- (not slug) to be robust to slug differences from earlier migrations.

-- 1) Delete generic placeholders for Physics + Chemistry ---------------------
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id in ('physics', 'chemistry')
   and t.name in (
     'Concepts & Definitions', 'Worked Examples', 'Formulae & Shortcuts',
     'Common Mistakes', 'Mixed Practice', 'Practice Set'
   );

-- 2) Seed real per-chapter sub-topics ---------------------------------------
with raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values

  -- ============ PHYSICS (20 chapters) ============

  -- Class 11
  ('physics', 'Physical World', 'Scope & Nature of Physics',         'scope',      1),
  ('physics', 'Physical World', 'Fundamental Forces',                'forces',     2),
  ('physics', 'Physical World', 'Branches & Application Areas',      'branches',   3),
  ('physics', 'Physical World', 'Conservation Laws (Intro)',         'conservation', 4),
  ('physics', 'Physical World', 'Physics & Society',                 'society',    5),
  ('physics', 'Physical World', 'Historical Development & Theories', 'historical', 6),

  ('physics', 'Units and Measurements', 'SI Units & Base Quantities',          'si-units',     1),
  ('physics', 'Units and Measurements', 'Dimensions & Dimensional Analysis',   'dimensions',   2),
  ('physics', 'Units and Measurements', 'Significant Figures & Rounding',      'sig-figures',  3),
  ('physics', 'Units and Measurements', 'Errors in Measurement',               'errors',       4),
  ('physics', 'Units and Measurements', 'Vernier Calipers & Screw Gauge',      'instruments',  5),
  ('physics', 'Units and Measurements', 'Order of Magnitude Estimation',       'estimation',   6),

  ('physics', 'Motion in a Straight Line', 'Position, Distance & Displacement', 'position',       1),
  ('physics', 'Motion in a Straight Line', 'Average vs Instantaneous Velocity', 'velocity',       2),
  ('physics', 'Motion in a Straight Line', 'Acceleration & Equations of Motion', 'equations',     3),
  ('physics', 'Motion in a Straight Line', 'Graphical Representation (x-t, v-t)', 'graphs',       4),
  ('physics', 'Motion in a Straight Line', 'Free Fall & Vertical Motion',       'free-fall',     5),
  ('physics', 'Motion in a Straight Line', 'Relative Velocity (1D)',            'relative',      6),

  ('physics', 'Motion in a Plane', 'Scalars vs Vectors',                       'scalars-vectors', 1),
  ('physics', 'Motion in a Plane', 'Vector Addition & Resolution',             'vector-add',     2),
  ('physics', 'Motion in a Plane', 'Projectile Motion',                        'projectile',     3),
  ('physics', 'Motion in a Plane', 'Uniform Circular Motion',                  'circular',       4),
  ('physics', 'Motion in a Plane', 'Relative Velocity (2D)',                   'relative-2d',    5),
  ('physics', 'Motion in a Plane', 'River-Boat & Rain-Man Problems',           'river-boat',     6),

  ('physics', 'Laws of Motion', 'Newton''s First Law & Inertia',         'first-law',   1),
  ('physics', 'Laws of Motion', 'Newton''s Second Law & Momentum',       'second-law',  2),
  ('physics', 'Laws of Motion', 'Newton''s Third Law & Action-Reaction', 'third-law',   3),
  ('physics', 'Laws of Motion', 'Friction (Static & Kinetic)',          'friction',    4),
  ('physics', 'Laws of Motion', 'Circular Motion Dynamics',             'circular-dyn', 5),
  ('physics', 'Laws of Motion', 'Pseudo Forces in Non-Inertial Frames', 'pseudo',      6),

  ('physics', 'Work, Energy and Power', 'Work Done by Constant & Variable Force', 'work',        1),
  ('physics', 'Work, Energy and Power', 'Kinetic Energy & Work-Energy Theorem',   'ke-theorem',  2),
  ('physics', 'Work, Energy and Power', 'Potential Energy (Gravity & Spring)',    'pe',          3),
  ('physics', 'Work, Energy and Power', 'Conservation of Mechanical Energy',      'conservation', 4),
  ('physics', 'Work, Energy and Power', 'Collisions (Elastic & Inelastic)',       'collisions',  5),
  ('physics', 'Work, Energy and Power', 'Power & Efficiency',                     'power',       6),

  ('physics', 'System of Particles and Rotational Motion', 'Centre of Mass',                  'com',          1),
  ('physics', 'System of Particles and Rotational Motion', 'Moment of Inertia & Theorems',    'moi',          2),
  ('physics', 'System of Particles and Rotational Motion', 'Angular Velocity & Acceleration', 'angular',      3),
  ('physics', 'System of Particles and Rotational Motion', 'Torque & Angular Momentum',       'torque',       4),
  ('physics', 'System of Particles and Rotational Motion', 'Rolling Motion',                  'rolling',      5),
  ('physics', 'System of Particles and Rotational Motion', 'Conservation of Angular Momentum', 'conservation', 6),

  ('physics', 'Gravitation', 'Universal Law of Gravitation',         'law',         1),
  ('physics', 'Gravitation', 'Gravitational Field & Potential',      'field-pot',   2),
  ('physics', 'Gravitation', 'Acceleration Due to Gravity (Earth)',  'g-earth',     3),
  ('physics', 'Gravitation', 'Orbital & Escape Velocity',            'orbital',     4),
  ('physics', 'Gravitation', 'Kepler''s Laws of Planetary Motion',    'kepler',      5),
  ('physics', 'Gravitation', 'Geostationary & Polar Satellites',     'satellites',  6),

  ('physics', 'Mechanical Properties of Solids and Fluids', 'Stress, Strain & Hooke''s Law',  'stress-strain', 1),
  ('physics', 'Mechanical Properties of Solids and Fluids', 'Young''s, Bulk & Shear Modulus', 'moduli',        2),
  ('physics', 'Mechanical Properties of Solids and Fluids', 'Pressure & Pascal''s Law',       'pressure',      3),
  ('physics', 'Mechanical Properties of Solids and Fluids', 'Bernoulli''s Principle',         'bernoulli',     4),
  ('physics', 'Mechanical Properties of Solids and Fluids', 'Viscosity & Stokes'' Law',       'viscosity',     5),
  ('physics', 'Mechanical Properties of Solids and Fluids', 'Surface Tension & Capillarity', 'surface-tension', 6),

  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'Heat, Temperature & Thermal Expansion', 'heat-temp',  1),
  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'Specific Heat & Calorimetry',          'specific',   2),
  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'Modes of Heat Transfer',               'transfer',   3),
  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'First Law of Thermodynamics',          'first-law',  4),
  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'Thermodynamic Processes & PV Diagrams', 'processes', 5),
  ('physics', 'Thermal Properties of Matter and Thermodynamics', 'Second Law & Carnot Engine',           'second-law', 6),

  ('physics', 'Oscillations and Waves', 'Simple Harmonic Motion (Basics)',     'shm',          1),
  ('physics', 'Oscillations and Waves', 'Energy in SHM',                       'energy-shm',   2),
  ('physics', 'Oscillations and Waves', 'Simple Pendulum & Spring-Mass',       'pendulum',     3),
  ('physics', 'Oscillations and Waves', 'Wave Motion & Wave Equation',         'wave-motion',  4),
  ('physics', 'Oscillations and Waves', 'Superposition, Beats & Stationary Waves', 'superposition', 5),
  ('physics', 'Oscillations and Waves', 'Doppler Effect',                      'doppler',      6),

  -- Class 12
  ('physics', 'Electric Charges and Fields', 'Coulomb''s Law & Force Vector',    'coulomb',     1),
  ('physics', 'Electric Charges and Fields', 'Electric Field & Field Lines',    'field-lines', 2),
  ('physics', 'Electric Charges and Fields', 'Dipole Moment & Field',           'dipole',      3),
  ('physics', 'Electric Charges and Fields', 'Gauss''s Law & Applications',      'gauss',       4),
  ('physics', 'Electric Charges and Fields', 'Field from Continuous Distribution', 'continuous', 5),
  ('physics', 'Electric Charges and Fields', 'Electric Flux',                   'flux',        6),

  ('physics', 'Electrostatic Potential and Capacitance', 'Potential Due to Point Charge & Dipole', 'potential',    1),
  ('physics', 'Electrostatic Potential and Capacitance', 'Equipotential Surfaces',                'equipotential', 2),
  ('physics', 'Electrostatic Potential and Capacitance', 'Capacitance of Parallel-Plate Capacitor', 'capacitance',  3),
  ('physics', 'Electrostatic Potential and Capacitance', 'Series & Parallel Combinations',        'combinations', 4),
  ('physics', 'Electrostatic Potential and Capacitance', 'Energy Stored in Capacitor',            'energy',       5),
  ('physics', 'Electrostatic Potential and Capacitance', 'Dielectrics & Polarization',            'dielectrics',  6),

  ('physics', 'Current Electricity', 'Ohm''s Law & Resistance',           'ohm',           1),
  ('physics', 'Current Electricity', 'Resistivity & Temperature Dependence', 'resistivity', 2),
  ('physics', 'Current Electricity', 'Kirchhoff''s Laws',                 'kirchhoff',     3),
  ('physics', 'Current Electricity', 'Wheatstone Bridge & Potentiometer', 'wheatstone',    4),
  ('physics', 'Current Electricity', 'EMF, Internal Resistance & Cells',  'emf',           5),
  ('physics', 'Current Electricity', 'Drift Velocity & Mobility',         'drift',         6),

  ('physics', 'Magnetic Effects of Current and Magnetism', 'Biot-Savart Law',                  'biot-savart',    1),
  ('physics', 'Magnetic Effects of Current and Magnetism', 'Ampere''s Circuital Law',           'ampere',         2),
  ('physics', 'Magnetic Effects of Current and Magnetism', 'Force on Charge & Wire',           'force',          3),
  ('physics', 'Magnetic Effects of Current and Magnetism', 'Solenoid & Toroid',                'solenoid',       4),
  ('physics', 'Magnetic Effects of Current and Magnetism', 'Magnetic Properties of Materials', 'materials',      5),
  ('physics', 'Magnetic Effects of Current and Magnetism', 'Moving Coil Galvanometer',         'galvanometer',   6),

  ('physics', 'Electromagnetic Induction and Alternating Current', 'Faraday''s Law & Lenz''s Law',     'faraday',     1),
  ('physics', 'Electromagnetic Induction and Alternating Current', 'Self & Mutual Inductance',       'inductance',  2),
  ('physics', 'Electromagnetic Induction and Alternating Current', 'AC Generator & Transformer',     'ac-generator', 3),
  ('physics', 'Electromagnetic Induction and Alternating Current', 'RMS, Peak & Average Values',     'rms',         4),
  ('physics', 'Electromagnetic Induction and Alternating Current', 'LCR Series Circuit & Resonance', 'lcr',         5),
  ('physics', 'Electromagnetic Induction and Alternating Current', 'Power in AC Circuits',           'power',       6),

  ('physics', 'Electromagnetic Waves', 'Maxwell''s Equations (qualitative)', 'maxwell',     1),
  ('physics', 'Electromagnetic Waves', 'EM Spectrum & Wavelength Ranges',   'spectrum',    2),
  ('physics', 'Electromagnetic Waves', 'Radio, Micro & Infrared Waves',     'radio-micro', 3),
  ('physics', 'Electromagnetic Waves', 'Visible, UV & X-Rays',              'visible-uv',  4),
  ('physics', 'Electromagnetic Waves', 'Gamma Rays & Applications',         'gamma',       5),
  ('physics', 'Electromagnetic Waves', 'Properties & Speed of Light',       'properties',  6),

  ('physics', 'Optics', 'Reflection & Mirrors',                 'reflection',  1),
  ('physics', 'Optics', 'Refraction & Lens Formula',            'refraction',  2),
  ('physics', 'Optics', 'Total Internal Reflection',            'tir',         3),
  ('physics', 'Optics', 'Optical Instruments (Microscope, Telescope)', 'instruments', 4),
  ('physics', 'Optics', 'Wave Optics — Interference (YDSE)',    'interference', 5),
  ('physics', 'Optics', 'Diffraction & Polarization',           'diffraction', 6),

  ('physics', 'Dual Nature of Matter and Radiation', 'Photoelectric Effect',           'photoelectric', 1),
  ('physics', 'Dual Nature of Matter and Radiation', 'Einstein''s Equation',            'einstein',      2),
  ('physics', 'Dual Nature of Matter and Radiation', 'de Broglie Hypothesis',          'de-broglie',    3),
  ('physics', 'Dual Nature of Matter and Radiation', 'Davisson-Germer Experiment',     'davisson',      4),
  ('physics', 'Dual Nature of Matter and Radiation', 'Wave-Particle Duality',          'duality',       5),
  ('physics', 'Dual Nature of Matter and Radiation', 'Work Function & Threshold',      'work-function', 6),

  ('physics', 'Atoms and Nuclei', 'Bohr Model of Hydrogen Atom',     'bohr',        1),
  ('physics', 'Atoms and Nuclei', 'Hydrogen Spectrum & Series',      'spectrum',    2),
  ('physics', 'Atoms and Nuclei', 'Nuclear Composition & Size',      'composition', 3),
  ('physics', 'Atoms and Nuclei', 'Mass Defect & Binding Energy',    'binding',     4),
  ('physics', 'Atoms and Nuclei', 'Radioactivity & Decay Law',       'radioactivity', 5),
  ('physics', 'Atoms and Nuclei', 'Fission, Fusion & Chain Reaction', 'fission-fusion', 6),

  ('physics', 'Semiconductor Electronics', 'Intrinsic & Extrinsic Semiconductors', 'intrinsic',   1),
  ('physics', 'Semiconductor Electronics', 'PN Junction Diode',                    'pn-junction', 2),
  ('physics', 'Semiconductor Electronics', 'Diode as Rectifier (Half & Full Wave)', 'rectifier',   3),
  ('physics', 'Semiconductor Electronics', 'Zener Diode & Voltage Regulator',      'zener',       4),
  ('physics', 'Semiconductor Electronics', 'Transistor as Amplifier & Switch',     'transistor',  5),
  ('physics', 'Semiconductor Electronics', 'Logic Gates (AND, OR, NOT, NAND, NOR)', 'logic-gates', 6),

  -- ============ CHEMISTRY (29 chapters) ============

  -- Physical Chemistry
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Mole Concept & Avogadro''s Number', 'mole',         1),
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Stoichiometry & Limiting Reagent', 'stoichiometry', 2),
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Empirical & Molecular Formula',    'formula',      3),
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Concentration Terms',              'concentration', 4),
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Atomic Mass & Equivalent Weight',  'atomic-mass',  5),
  ('chemistry', 'Some Basic Concepts of Chemistry', 'Percentage Composition Problems',  'percentage',   6),

  ('chemistry', 'Structure of Atom', 'Subatomic Particles & Atomic Models', 'models',      1),
  ('chemistry', 'Structure of Atom', 'Bohr''s Model & Hydrogen Spectrum',    'bohr',        2),
  ('chemistry', 'Structure of Atom', 'Quantum Numbers & Orbital Shapes',    'quantum',     3),
  ('chemistry', 'Structure of Atom', 'Aufbau, Hund''s Rule & Pauli',         'aufbau',      4),
  ('chemistry', 'Structure of Atom', 'Electronic Configuration',            'config',      5),
  ('chemistry', 'Structure of Atom', 'Heisenberg Uncertainty Principle',    'heisenberg',  6),

  ('chemistry', 'Classification & Periodicity', 'Modern Periodic Law',         'periodic-law', 1),
  ('chemistry', 'Classification & Periodicity', 'Periodic Trends (Size, IE, EA)', 'trends',    2),
  ('chemistry', 'Classification & Periodicity', 'Electronegativity & Metallic Character', 'electroneg', 3),
  ('chemistry', 'Classification & Periodicity', 's, p, d, f Block Classification', 'blocks',    4),
  ('chemistry', 'Classification & Periodicity', 'Anomalous Properties',         'anomalous',   5),
  ('chemistry', 'Classification & Periodicity', 'Atomic & Ionic Radii',         'radii',       6),

  ('chemistry', 'Chemical Bonding & Molecular Structure', 'Ionic & Covalent Bonds',          'ionic-covalent', 1),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'VSEPR Theory & Shape Prediction', 'vsepr',          2),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'Valence Bond & Hybridization',    'hybridization',  3),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'Molecular Orbital Theory',        'mot',            4),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'Hydrogen Bonding',                'hydrogen',       5),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'Dipole Moment & Polarity',        'dipole',         6),

  ('chemistry', 'States of Matter', 'Gas Laws (Boyle, Charles, Avogadro)', 'gas-laws',  1),
  ('chemistry', 'States of Matter', 'Ideal Gas Equation',                  'ideal-gas', 2),
  ('chemistry', 'States of Matter', 'Kinetic Molecular Theory',            'kmt',       3),
  ('chemistry', 'States of Matter', 'Real Gases & Deviation',              'real-gas',  4),
  ('chemistry', 'States of Matter', 'Liquid State Properties',             'liquid',    5),
  ('chemistry', 'States of Matter', 'Critical State & Liquefaction',       'critical',  6),

  ('chemistry', 'Chemical Thermodynamics', 'System, Surroundings & Types', 'system',       1),
  ('chemistry', 'Chemical Thermodynamics', 'First Law & Internal Energy',  'first-law',    2),
  ('chemistry', 'Chemical Thermodynamics', 'Enthalpy & Heat of Reaction',  'enthalpy',     3),
  ('chemistry', 'Chemical Thermodynamics', 'Hess''s Law',                   'hess',         4),
  ('chemistry', 'Chemical Thermodynamics', 'Entropy & Gibbs Free Energy',  'entropy-gibbs', 5),
  ('chemistry', 'Chemical Thermodynamics', 'Spontaneity & Equilibrium',    'spontaneity',  6),

  ('chemistry', 'Equilibrium', 'Reversible Reactions & Kc/Kp',     'kc-kp',         1),
  ('chemistry', 'Equilibrium', 'Le Chatelier''s Principle',         'le-chatelier',  2),
  ('chemistry', 'Equilibrium', 'Ionic Equilibrium & pH',           'ionic',         3),
  ('chemistry', 'Equilibrium', 'Buffer Solutions',                 'buffer',        4),
  ('chemistry', 'Equilibrium', 'Solubility Product (Ksp)',         'ksp',           5),
  ('chemistry', 'Equilibrium', 'Acids & Bases (Brønsted, Lewis)',  'acid-base',     6),

  ('chemistry', 'Redox Reactions', 'Oxidation States',               'oxidation-state', 1),
  ('chemistry', 'Redox Reactions', 'Balancing Redox Equations',      'balancing',       2),
  ('chemistry', 'Redox Reactions', 'Oxidizing & Reducing Agents',    'agents',          3),
  ('chemistry', 'Redox Reactions', 'Disproportionation Reactions',   'disproportionation', 4),
  ('chemistry', 'Redox Reactions', 'Electrochemical Cell (Intro)',   'electrochem',     5),
  ('chemistry', 'Redox Reactions', 'n-Factor Concept',               'n-factor',        6),

  ('chemistry', 'Solid State', 'Crystalline vs Amorphous',        'crystalline',    1),
  ('chemistry', 'Solid State', 'Bravais Lattices & Unit Cells',   'lattices',       2),
  ('chemistry', 'Solid State', 'Packing Efficiency (BCC, FCC)',   'packing',        3),
  ('chemistry', 'Solid State', 'Density Calculation from Lattice', 'density',       4),
  ('chemistry', 'Solid State', 'Defects in Solids (Point Defects)', 'defects',       5),
  ('chemistry', 'Solid State', 'Magnetic & Electrical Properties', 'magnetic-elec', 6),

  ('chemistry', 'Solutions', 'Types of Solutions & Solubility', 'types',         1),
  ('chemistry', 'Solutions', 'Concentration Expressions',       'concentration', 2),
  ('chemistry', 'Solutions', 'Raoult''s Law & Vapor Pressure',   'raoult',        3),
  ('chemistry', 'Solutions', 'Colligative Properties',          'colligative',   4),
  ('chemistry', 'Solutions', 'Osmotic Pressure & Osmosis',      'osmotic',       5),
  ('chemistry', 'Solutions', 'Abnormal Molar Mass & van''t Hoff Factor', 'vant-hoff', 6),

  ('chemistry', 'Electrochemistry', 'Galvanic & Electrolytic Cells', 'cells',         1),
  ('chemistry', 'Electrochemistry', 'EMF & Cell Potential',          'emf',           2),
  ('chemistry', 'Electrochemistry', 'Nernst Equation',               'nernst',        3),
  ('chemistry', 'Electrochemistry', 'Electrolytic Conductance & Kohlrausch', 'conductance', 4),
  ('chemistry', 'Electrochemistry', 'Faraday''s Laws of Electrolysis', 'faraday',     5),
  ('chemistry', 'Electrochemistry', 'Batteries & Fuel Cells',        'batteries',     6),

  ('chemistry', 'Chemical Kinetics', 'Rate of Reaction & Rate Law',  'rate-law',     1),
  ('chemistry', 'Chemical Kinetics', 'Order & Molecularity',         'order',        2),
  ('chemistry', 'Chemical Kinetics', 'Integrated Rate Equations',    'integrated',   3),
  ('chemistry', 'Chemical Kinetics', 'Half-Life of Reactions',       'half-life',    4),
  ('chemistry', 'Chemical Kinetics', 'Arrhenius Equation & Activation Energy', 'arrhenius', 5),
  ('chemistry', 'Chemical Kinetics', 'Effect of Catalyst & Concentration', 'catalyst', 6),

  ('chemistry', 'Surface Chemistry', 'Adsorption & Types',           'adsorption',  1),
  ('chemistry', 'Surface Chemistry', 'Catalysis (Homo & Hetero)',    'catalysis',   2),
  ('chemistry', 'Surface Chemistry', 'Colloids & Classification',    'colloids',    3),
  ('chemistry', 'Surface Chemistry', 'Tyndall Effect & Brownian Motion', 'tyndall', 4),
  ('chemistry', 'Surface Chemistry', 'Emulsions & Coagulation',      'emulsions',   5),
  ('chemistry', 'Surface Chemistry', 'Enzyme Catalysis',             'enzyme',      6),

  -- Inorganic Chemistry
  ('chemistry', 'Hydrogen', 'Position in Periodic Table',        'position',  1),
  ('chemistry', 'Hydrogen', 'Isotopes of Hydrogen',              'isotopes',  2),
  ('chemistry', 'Hydrogen', 'Hydrides (Ionic, Covalent, Interstitial)', 'hydrides', 3),
  ('chemistry', 'Hydrogen', 'Water — Structure & Hardness',      'water',     4),
  ('chemistry', 'Hydrogen', 'Hydrogen Peroxide — Prep & Uses',   'h2o2',      5),
  ('chemistry', 'Hydrogen', 'Hydrogen as a Fuel',                'fuel',      6),

  ('chemistry', 's-Block Elements', 'Group 1 (Alkali Metals) Properties',   'alkali',       1),
  ('chemistry', 's-Block Elements', 'Group 2 (Alkaline Earth) Properties',  'alkaline',     2),
  ('chemistry', 's-Block Elements', 'Anomalous Behavior of Li & Be',        'anomalous',    3),
  ('chemistry', 's-Block Elements', 'Diagonal Relationship',                'diagonal',     4),
  ('chemistry', 's-Block Elements', 'Important Compounds (Na, K, Mg, Ca)', 'compounds',    5),
  ('chemistry', 's-Block Elements', 'Biological Importance',                'biological',   6),

  ('chemistry', 'p-Block Elements (Class 11)', 'Group 13 (Boron Family) Properties',  'group-13',  1),
  ('chemistry', 'p-Block Elements (Class 11)', 'Group 14 (Carbon Family) Properties', 'group-14',  2),
  ('chemistry', 'p-Block Elements (Class 11)', 'Diborane & Borax',                    'diborane',  3),
  ('chemistry', 'p-Block Elements (Class 11)', 'Allotropes of Carbon',                'allotropes', 4),
  ('chemistry', 'p-Block Elements (Class 11)', 'Silicates & Silicones',               'silicates', 5),
  ('chemistry', 'p-Block Elements (Class 11)', 'Anomalous Behavior of B & C',         'anomalous', 6),

  ('chemistry', 'p-Block Elements (Class 12)', 'Group 15 (Nitrogen Family)',    'group-15',  1),
  ('chemistry', 'p-Block Elements (Class 12)', 'Group 16 (Oxygen Family)',      'group-16',  2),
  ('chemistry', 'p-Block Elements (Class 12)', 'Group 17 (Halogens) Properties', 'halogens', 3),
  ('chemistry', 'p-Block Elements (Class 12)', 'Group 18 (Noble Gases)',        'noble',     4),
  ('chemistry', 'p-Block Elements (Class 12)', 'Oxoacids & Interhalogen Compounds', 'oxoacids', 5),
  ('chemistry', 'p-Block Elements (Class 12)', 'Important Compounds (HNO3, H2SO4)', 'important', 6),

  ('chemistry', 'd & f Block Elements', 'General Properties of Transition Metals', 'general',    1),
  ('chemistry', 'd & f Block Elements', 'Variable Oxidation States',              'oxidation',  2),
  ('chemistry', 'd & f Block Elements', 'Magnetic & Color Properties',            'magnetic',   3),
  ('chemistry', 'd & f Block Elements', 'Lanthanide & Actinide Contraction',      'contraction', 4),
  ('chemistry', 'd & f Block Elements', 'Catalytic Behavior',                     'catalytic',  5),
  ('chemistry', 'd & f Block Elements', 'Important Compounds (KMnO4, K2Cr2O7)',   'compounds',  6),

  ('chemistry', 'Coordination Compounds', 'Werner''s Theory & Coordination Number', 'werner',      1),
  ('chemistry', 'Coordination Compounds', 'IUPAC Nomenclature',                    'nomenclature', 2),
  ('chemistry', 'Coordination Compounds', 'Isomerism (Structural & Stereo)',       'isomerism',   3),
  ('chemistry', 'Coordination Compounds', 'Valence Bond Theory (VBT)',             'vbt',         4),
  ('chemistry', 'Coordination Compounds', 'Crystal Field Theory (CFT)',            'cft',         5),
  ('chemistry', 'Coordination Compounds', 'Applications in Biology & Industry',    'applications', 6),

  -- Organic Chemistry
  ('chemistry', 'Organic Chemistry: Basic Principles', 'Classification of Organic Compounds', 'classification', 1),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'IUPAC Nomenclature Rules',            'nomenclature',   2),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'Isomerism (Structural & Stereo)',     'isomerism',      3),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'Inductive, Mesomeric & Hyperconjugation', 'electronic-effects', 4),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'Reaction Intermediates (Carbocation, Radical)', 'intermediates', 5),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'Reaction Types (Substitution, Addition, Elimination)', 'reaction-types', 6),

  ('chemistry', 'Hydrocarbons', 'Alkanes — Properties & Reactions',    'alkanes',   1),
  ('chemistry', 'Hydrocarbons', 'Alkenes — Markovnikov & Reactions',   'alkenes',   2),
  ('chemistry', 'Hydrocarbons', 'Alkynes — Properties & Acidity',      'alkynes',   3),
  ('chemistry', 'Hydrocarbons', 'Aromatic Hydrocarbons — Benzene',     'aromatic',  4),
  ('chemistry', 'Hydrocarbons', 'Electrophilic Aromatic Substitution', 'eas',       5),
  ('chemistry', 'Hydrocarbons', 'Friedel-Crafts Reaction',             'friedel-crafts', 6),

  ('chemistry', 'Haloalkanes & Haloarenes', 'Nomenclature & Types',          'nomenclature', 1),
  ('chemistry', 'Haloalkanes & Haloarenes', 'SN1 & SN2 Mechanisms',          'sn1-sn2',      2),
  ('chemistry', 'Haloalkanes & Haloarenes', 'Elimination (E1, E2) Reactions', 'elimination',  3),
  ('chemistry', 'Haloalkanes & Haloarenes', 'Reactivity of Aryl Halides',    'aryl',         4),
  ('chemistry', 'Haloalkanes & Haloarenes', 'Polyhalogen Compounds (CHCl3, CCl4)', 'polyhalogen', 5),
  ('chemistry', 'Haloalkanes & Haloarenes', 'Optical Activity in Halides',   'optical',      6),

  ('chemistry', 'Alcohols, Phenols & Ethers', 'Preparation of Alcohols',         'prep-alcohols', 1),
  ('chemistry', 'Alcohols, Phenols & Ethers', 'Acidity & Esterification',        'esterification', 2),
  ('chemistry', 'Alcohols, Phenols & Ethers', 'Oxidation of Alcohols',           'oxidation',     3),
  ('chemistry', 'Alcohols, Phenols & Ethers', 'Phenols — Preparation & Reactions', 'phenols',     4),
  ('chemistry', 'Alcohols, Phenols & Ethers', 'Williamson Ether Synthesis',      'williamson',    5),
  ('chemistry', 'Alcohols, Phenols & Ethers', 'Distinction Tests (Lucas, Iodoform)', 'tests',     6),

  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'Preparation Methods',           'preparation',  1),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'Nucleophilic Addition Reactions', 'nucleophilic', 2),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'Aldol & Cannizzaro Reactions',   'aldol-cannizzaro', 3),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'Acidity of Carboxylic Acids',    'acidity',      4),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'HVZ Reaction & α-Halogenation',  'hvz',          5),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'Distinction Tests (Tollens, Fehling)', 'tests',  6),

  ('chemistry', 'Amines', 'Classification & Nomenclature',  'classification', 1),
  ('chemistry', 'Amines', 'Preparation of Amines',          'preparation',    2),
  ('chemistry', 'Amines', 'Basicity of Amines',             'basicity',       3),
  ('chemistry', 'Amines', 'Reactions with Acids & Hofmann', 'reactions',      4),
  ('chemistry', 'Amines', 'Diazonium Salts',                'diazonium',      5),
  ('chemistry', 'Amines', 'Carbylamine & Hinsberg Test',    'carbylamine',    6),

  ('chemistry', 'Biomolecules', 'Carbohydrates (Mono, Di, Poly)',     'carbohydrates', 1),
  ('chemistry', 'Biomolecules', 'Proteins & Amino Acids',             'proteins',      2),
  ('chemistry', 'Biomolecules', 'Enzymes & Their Action',             'enzymes',       3),
  ('chemistry', 'Biomolecules', 'Vitamins (Fat & Water Soluble)',     'vitamins',      4),
  ('chemistry', 'Biomolecules', 'Nucleic Acids (DNA, RNA)',           'nucleic',       5),
  ('chemistry', 'Biomolecules', 'Hormones — Structure & Function',    'hormones',      6),

  ('chemistry', 'Polymers', 'Classification of Polymers',        'classification', 1),
  ('chemistry', 'Polymers', 'Addition Polymerization',           'addition',       2),
  ('chemistry', 'Polymers', 'Condensation Polymerization',       'condensation',   3),
  ('chemistry', 'Polymers', 'Natural Polymers (Rubber, Cellulose)', 'natural',     4),
  ('chemistry', 'Polymers', 'Synthetic Polymers (Nylon, Bakelite)', 'synthetic',   5),
  ('chemistry', 'Polymers', 'Biodegradable Polymers',            'biodegradable',  6),

  ('chemistry', 'Chemistry in Everyday Life', 'Drugs & Their Classification',  'drugs',         1),
  ('chemistry', 'Chemistry in Everyday Life', 'Antibiotics & Antiseptics',     'antibiotics',   2),
  ('chemistry', 'Chemistry in Everyday Life', 'Soaps, Detergents & Cleansing', 'soaps',         3),
  ('chemistry', 'Chemistry in Everyday Life', 'Food Preservatives & Additives', 'preservatives', 4),
  ('chemistry', 'Chemistry in Everyday Life', 'Artificial Sweetening Agents',  'sweeteners',    5),
  ('chemistry', 'Chemistry in Everyday Life', 'Antacids, Antihistamines & Tranquilizers', 'medicines', 6),

  ('chemistry', 'Environmental Chemistry', 'Atmospheric Pollution',         'air-pollution',   1),
  ('chemistry', 'Environmental Chemistry', 'Acid Rain & Greenhouse Effect', 'acid-rain',       2),
  ('chemistry', 'Environmental Chemistry', 'Ozone Layer Depletion',         'ozone',           3),
  ('chemistry', 'Environmental Chemistry', 'Water Pollution & BOD',         'water-pollution', 4),
  ('chemistry', 'Environmental Chemistry', 'Soil Pollution & Pesticides',   'soil',            5),
  ('chemistry', 'Environmental Chemistry', 'Green Chemistry & Mitigation',  'green',           6)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name),
       r.ord
from raw r
join public.chapters c on c.name = r.chapter_name
join public.subjects s on s.id = c.subject_id and s.id = r.subject_id
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

-- Verify with:
--   select s.name as subject, c.name as chapter, count(t.id) as topics
--     from chapters c
--     join subjects s on s.id = c.subject_id
--     left join topics t on t.chapter_id = c.id
--    where s.id in ('physics', 'chemistry')
--    group by s.name, c.name order by topics desc, s.name, c.name;
--   -- expect: each chapter shows 6 topics
